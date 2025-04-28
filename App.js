import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoryScreen from './screens/CategoryScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Categories">
        <Stack.Screen name="Categories" component={CategoryScreen} />
        <Stack.Screen name="Products" component={ProductListScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
