import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://172.20.10.5:3000/products/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Choose a Category</Text>
      {categories.map((category, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.categoryButton}
          onPress={() => navigation.navigate('Products', { category })}
        >
          <Text style={styles.buttonText}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  categoryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
