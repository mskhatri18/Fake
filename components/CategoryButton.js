import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b0c4de',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  text: { fontSize: 16, fontWeight: 'bold' },
});
