import React, { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const API_BASE = 'http://172.20.10.2:3000'; // Adjust to your IP

function ProductStack() {
  return (
    <Stack.Navigator initialRouteName="Categories">
      <Stack.Screen name="Categories" component={CategoryScreen} />
      <Stack.Screen name="Products" component={ProductListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

function ProtectedRoute({ isLoggedIn, navigation, children }) {
  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please sign in first.');
      navigation.navigate('Auth');
    }
  }, [isLoggedIn]);

  return isLoggedIn ? children : null;
}

function MainAppTabs({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const checkAuthAndOrders = async () => {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');

        setIsLoggedIn(!!token);

        if (token) {
          try {
            const res = await fetch(`${API_BASE}/orders/all`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const json = await res.json();
            const orders = json.orders || [];
            const newOrders = orders.filter(o => !o.is_paid);
            setNewOrderCount(newOrders.length);
          } catch (err) {
            console.warn('Order badge fetch failed:', err.message);
          }
        }

        setLoading(false);
      };

      checkAuthAndOrders();
    }, [])
  );

  if (loading) return null;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={ProductStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cart"
        children={props => (
          <ProtectedRoute isLoggedIn={isLoggedIn} navigation={props.navigation}>
            <ShoppingCartScreen {...props} />
          </ProtectedRoute>
        )}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="My Orders"
        children={props => (
          <ProtectedRoute isLoggedIn={isLoggedIn} navigation={props.navigation}>
            <MyOrdersScreen {...props} />
          </ProtectedRoute>
        )}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt-outline" color={color} size={size} />
          ),
          tabBarBadge: newOrderCount > 0 ? newOrderCount : null,
        }}
      />
      <Tab.Screen
        name="Profile"
        children={props => (
          <ProtectedRoute isLoggedIn={isLoggedIn} navigation={props.navigation}>
            <UserProfileScreen {...props} />
          </ProtectedRoute>
        )}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainApp" component={MainAppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
