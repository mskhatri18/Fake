import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://172.20.10.2:3000'; // Replace with your LAN IP

export default function AuthScreen({ navigation }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  const handleClear = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    if (isSignUp && !isEmailValid(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      if (isSignUp) {
        const signupRes = await fetch(`${API_BASE}/users/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const signupBody = await signupRes.text();
        if (!signupRes.ok) {
          throw new Error(signupBody || 'Signup failed');
        }

        Alert.alert('Signed Up', 'Account created! Logging in...');
      }

      const signinRes = await fetch(`${API_BASE}/users/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const signinBody = await signinRes.text();
      let loginData;
      try {
        loginData = JSON.parse(signinBody);
      } catch {
        throw new Error('Unexpected response format from server.');
      }

      const { token, name: uName, email: uEmail, id, status } = loginData;

      if (status !== 'OK' || !token || !uName || !uEmail || !id) {
        throw new Error('Missing fields in login response');
      }

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userName', uName);
      await AsyncStorage.setItem('userEmail', uEmail);
      await AsyncStorage.setItem('userId', String(id));

      Alert.alert('Success', `${isSignUp ? 'Signed Up' : 'Logged In'} as ${uName}`);
      navigation.replace('MainApp', { screen: 'Profile' });
    } catch (err) {
      console.error('Auth Error:', err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? 'Sign up a new user' : 'Sign in with your email and password'}
      </Text>

      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ccc', flex: 1, marginRight: 8 }]}
          onPress={handleClear}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  toggleText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10
  }
});
