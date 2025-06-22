import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface MessageType {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: string;
  sent_at: string;
  is_read: boolean;
  sender: {
    username: string;
    avatar: string | null;
  }[];
}

export default function Message() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchMessages();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('user_messages')
      .select('id, sender_id, receiver_id, message, message_type, sent_at, is_read, sender: user_records (username, avatar)')
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order('sent_at', { ascending: true });

    if (data) {
      setMessages(data as MessageType[]);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    await supabase.from('user_messages').insert([
      {
        sender_id: user?.id,
        receiver_id: null, // This should be set to the selected friend's user_id in a real app
        message: newMessage,
        message_type: 'text',
      },
    ]);

    setNewMessage('');
    fetchMessages();
  };

  const renderItem = ({ item }: { item: MessageType }) => (
    <Animated.View style={[styles.messageItem, { opacity: fadeAnim }]}>
      <Text style={styles.messageSender}>{item.sender[0]?.username}:</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>{new Date(item.sent_at).toLocaleTimeString()}</Text>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#888"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  messageItem: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#3bff31',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  messageSender: {
    color: '#3bff31',
    fontWeight: '700',
    marginBottom: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#3bff31',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});
