
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListenNowScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listen Now</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default ListenNowScreen;
