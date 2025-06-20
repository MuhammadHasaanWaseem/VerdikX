import { Tabs, useRouter } from 'expo-router';
import { Home, Map, Search, TorusIcon, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StatusBar, View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <>
      <StatusBar hidden={true} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#3bff31',
          tabBarInactiveTintColor: 'black',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            Platform.select({
              ios: {
                position: 'absolute',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
              },
              android: {
                elevation: 12,
              },
            }),
          ],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconWrapper}>
                <Home
                  fill={focused ? '#3bff31' : ''}
                  color={focused ? 'black' : 'black'}
                  size={26}
                />
                {focused && <View style={styles.activeDot} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconWrapper}>
                <Search
                  strokeWidth={focused ? 3 : 2}
                  color={focused ? 'black' : 'black'}
                  size={26}
                />
                {focused && <View style={styles.activeDot} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="tour"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.fabButton}>
                <TorusIcon
                  strokeWidth={focused ? 4 : 2}
                  color={'#3bff31'}
                  size={34}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="updates"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconWrapper}>
                <Map
                  fill={focused ? '#3bff31' : ''}
                  color={focused ? 'black' : 'black'}
                  size={26}
                />
                {focused && <View style={styles.activeDot} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconWrapper}>
                <User
                  fill={focused ? '#3bff31' : ''}
                  color={focused ? 'black' : 'black'}
                  size={26}
                />
                {focused && <View style={styles.activeDot} />}
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#3bff31',
    borderTopWidth: 0,
    height: 80,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingTop: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3bff31',
    marginTop: 4,
  },
  fabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 40,
    top: -25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
