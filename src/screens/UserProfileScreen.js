import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://172.20.10.2:3000'; // Replace with your LAN IP if needed

export default function UserProfileScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedId = await AsyncStorage.getItem('userId');

        if (!storedName || !storedEmail || !storedId) {
          throw new Error('Missing user data');
        }

        setName(storedName);
        setEmail(storedEmail);
        setUserId(storedId);
      } catch (err) {
        Alert.alert('Error', 'Failed to load profile.');
      }
    };
    loadUser();
  }, []);

  const handleUpdate = async () => {
    if (!newName && !newPassword) {
      Alert.alert('No changes', 'Enter new name or password.');
      return;
    }

    try {
      const payload = {
        id: parseInt(userId),
        ...(newName ? { name: newName } : {}),
        ...(newPassword ? { password: newPassword } : {})
      };

      const res = await fetch(`${API_BASE}/users/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Update failed');

      if (newName) {
        setName(newName);
        await AsyncStorage.setItem('userName', newName);
      }

      setNewName('');
      setNewPassword('');
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userToken',
        'userId',
        'userName',
        'userEmail',
      ]);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.profileBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.updateButton} onPress={() => setShowEditModal(true)}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              placeholder="New Name"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#888"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleUpdate}>
                <Text style={styles.modalBtnText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#bbb' }]} onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6f8' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, color: '#333', marginBottom: 10 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
