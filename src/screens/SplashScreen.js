// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');

      setTimeout(() => {
        if (token) {
          navigation.replace('MainApp'); // ✅ Go to main app if logged in
        } else {
          navigation.replace('Auth'); // ✅ Else show login
        }
      }, 3000);
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Fake Store</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
});
