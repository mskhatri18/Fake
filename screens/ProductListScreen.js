import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductListScreen({ route, navigation }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.backButtonContainer}>
        <Button title="Back to Categories" onPress={() => navigation.goBack()} color="#2ecc71" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#2ecc71',
  },
  backButtonContainer: {
    marginVertical: 10,
  },
});
