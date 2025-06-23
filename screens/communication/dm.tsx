import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DirectMessage() {
  const { user } = useAuth();
  const { receiver_id } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('user_messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user?.id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${user?.id})`
      )
      .order('sent_at', { ascending: true });

    if (!error) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (editingId) {
      await supabase
        .from('user_messages')
        .update({ message: newMessage })
        .eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('user_messages').insert([
        {
          sender_id: user?.id,
          receiver_id,
          message: newMessage,
          message_type: 'text',
        },
      ]);
    }

    setNewMessage('');
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await supabase.from('user_messages').delete().eq('id', id);
          fetchMessages();
        },
        style: 'destructive',
      },
    ]);
  };

  useEffect(() => {
    if (!receiver_id || !user?.id) return;
    fetchMessages();

    channelRef.current = supabase
      .channel('dm_' + [user.id, receiver_id].sort().join('_'))
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_messages',
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current);
    };
  }, [receiver_id, user?.id]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              {
                alignSelf:
                  item.sender_id === user?.id ? 'flex-end' : 'flex-start',
                backgroundColor:
                  item.sender_id === user?.id ? '#3bff31' : '#333',
              },
            ]}
          >
            <Text
              style={{
                color: item.sender_id === user?.id ? '#000' : '#fff',
              }}
            >
              {item.message}
            </Text>
            <Text
              style={{
                color: item.sender_id === user?.id ? '#333' : '#ccc',
                fontSize: 10,
                marginTop: 4,
                alignSelf: 'flex-end',
              }}
            >
              {item.sent_at ? new Date(item.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
            {item.sender_id === user?.id && (
              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() => {
                    setNewMessage(item.message);
                    setEditingId(item.id);
                  }}
                >
                  <Text style={styles.controlText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMessage(item.id)}>
                  <Text style={[styles.controlText, { color: 'red' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder={editingId ? 'Edit message' : 'Message'}
          placeholderTextColor="#aaa"
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>
            {editingId ? 'Update' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', padding: 20 },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 10,
  },
  controlText: {
    color: '#000',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#3bff31',
    padding: 10,
    marginLeft: 10,
    borderRadius: 20,
  },
});
