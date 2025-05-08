// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import MainNavigator from './MainNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
