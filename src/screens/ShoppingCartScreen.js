import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  clearCart
} from '../store/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://172.20.10.2:3000'; // Replace with your LAN IP

export default function ShoppingCartScreen({ navigation }) {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.quantity * item.price, 0)
    .toFixed(2);

  const handleCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to checkout.');
        return;
      }

      const orderItems = cartItems.map(item => ({
        prodID: item.id,
        price: item.price,
        quantity: item.quantity
      }));

      const body = JSON.stringify({ items: orderItems });

      const res = await fetch(`${API_BASE}/orders/neworder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create order');
      }

      dispatch(clearCart());

      Alert.alert('Success', 'Order placed successfully!');
      // Optionally navigate: navigation.navigate('My Orders');

    } catch (err) {
      console.error('Checkout error:', err);
      Alert.alert('Error', err.message || 'Checkout failed');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => dispatch(decreaseQuantity(item.id))}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => dispatch(increaseQuantity(item.id))}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your shopping cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>
        Items: {totalItems} | Total: ${totalPrice}
      </Text>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333'
  },
  itemContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    marginBottom: 12
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  itemPrice: {
    fontSize: 14,
    color: '#777',
    marginTop: 4
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  quantityButton: {
    fontSize: 20,
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 8
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  checkoutButton: {
    backgroundColor: '#1e90ff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#555'
  }
});
