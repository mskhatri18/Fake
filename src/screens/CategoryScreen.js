import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(); // Abort the request after 10 seconds
    }, 10000); // 10 seconds timeout

    console.log('Fetching categories...');
    
    fetch('http://172.20.10.2:3000/products/categories', {

      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.error('Fetch request timed out');
        } else {
          console.error('Fetch error:', error);
        }
        setLoading(false);
      });

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No categories available.</Text>
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
