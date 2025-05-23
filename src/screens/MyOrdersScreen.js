import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE = 'http://172.20.10.2:3000';

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Not Logged In', 'Please log in to view orders.');
          return;
        }

        try {
          const res = await fetch(`${API_BASE}/orders/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (!Array.isArray(data.orders)) throw new Error('Invalid order response');

          const cleaned = data.orders.map(order => ({
            ...order,
            status: order.is_delivered
              ? 'delivered'
              : order.is_paid
              ? 'paid'
              : 'new',
            show: false,
            items: JSON.parse(order.order_items),
            total: parseFloat(order.total_price) / 100, // FIXED here
          }));

          setOrders(cleaned);
        } catch (err) {
          console.error('Fetch error:', err);
          Alert.alert('Error', err.message || 'Failed to load orders.');
        }
      };

      fetchOrders();
    }, [])
  );

  const handleUpdateStatus = async (id, currentStatus) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const payload = {
      orderID: id,
      isPaid: currentStatus === 'new' ? 1 : 1,
      isDelivered: currentStatus === 'paid' ? 1 : 0,
    };

    try {
      const res = await fetch(`${API_BASE}/orders/updateorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update order status');

      const updated = orders.map(order =>
        order.id === id
          ? {
              ...order,
              status:
                currentStatus === 'new'
                  ? 'paid'
                  : currentStatus === 'paid'
                  ? 'delivered'
                  : order.status,
            }
          : order
      );
      setOrders(updated);
      Alert.alert('Success', 'Order status updated.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleToggleExpand = (id) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, show: !order.show } : order
    );
    setOrders(updated);
  };

  const renderOrderItem = (item) => (
    <View key={item.id} style={styles.orderCard}>
      <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
        <Text style={styles.orderHeader}>
          Order #{item.id} — {item.status.toUpperCase()}
        </Text>
        <Text style={styles.orderInfo}>
          {item.items.length} item(s), Total: ${item.total.toFixed(2)}
        </Text>
      </TouchableOpacity>

      {item.show && (
        <View style={styles.detailContainer}>
          {item.items.map((product, idx) => (
            <Text key={idx} style={styles.detailText}>
              • Product #{product.prodID} × {product.quantity} (${product.price})
            </Text>
          ))}
          {item.status === 'new' && (
            <TouchableOpacity
              style={styles.statusBtn}
              onPress={() => handleUpdateStatus(item.id, 'new')}
            >
              <Text style={styles.btnText}>Pay</Text>
            </TouchableOpacity>
          )}
          {item.status === 'paid' && (
            <TouchableOpacity
              style={styles.statusBtn}
              onPress={() => handleUpdateStatus(item.id, 'paid')}
            >
              <Text style={styles.btnText}>Receive</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const groupedOrders = {
    new: orders.filter(o => o.status === 'new'),
    paid: orders.filter(o => o.status === 'paid'),
    delivered: orders.filter(o => o.status === 'delivered'),
  };

  return orders.length === 0 ? (
    <View style={styles.centered}>
      <Text>No orders found.</Text>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.list}>
      {Object.entries(groupedOrders).map(([status, section]) => {
        if (section.length === 0) return null;

        const title =
          status === 'new'
            ? '🟡 Remaining to Pay'
            : status === 'paid'
            ? '🟠 Awaiting Delivery'
            : '✅ Delivered';

        return (
          <View key={status}>
            <Text style={styles.sectionHeader}>{title}</Text>
            {section.map(renderOrderItem)}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  orderCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
  orderHeader: { fontWeight: 'bold', fontSize: 16 },
  orderInfo: { fontSize: 14, marginVertical: 4 },
  detailContainer: { marginTop: 10 },
  detailText: { fontSize: 13 },
  statusBtn: {
    backgroundColor: '#3498db',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
