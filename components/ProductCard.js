import React from 'react';
import { TouchableOpacity, Text, Image, View, StyleSheet } from 'react-native';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>
        <Text>Price: ${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, marginVertical: 8, backgroundColor: '#f0f8ff', borderRadius: 10 },
  image: { width: 50, height: 50, marginRight: 10 },
  details: { justifyContent: 'center', flex: 1 },
  title: { fontSize: 14, fontWeight: 'bold' },
});
