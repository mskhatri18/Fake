import React from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>Rating: {product.rating.rate}</Text>
        <Text style={styles.rating}>({product.rating.count} reviews)</Text>
      </View>

      <Text style={styles.price}>${product.price}</Text>

      <Text style={styles.descriptionTitle}>Description:</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => {}}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Light background color for better contrast
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333', // Darker text color for readability
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginVertical: 15,
    resizeMode: 'contain',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  rating: {
    fontSize: 16,
    marginHorizontal: 5,
    color: '#555',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#e63946', // Bright color for price
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
    color: '#555',
    textAlign: 'justify',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    backgroundColor: '#457b9d', // Soft blue background for buttons
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#e63946', // Red background for 'Add to Cart'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
