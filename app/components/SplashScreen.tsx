
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.icon} />
      <Text style={styles.appName}>Spoton</Text>
      <Text style={styles.author}>By zohaib</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: '#fff',
    position: 'absolute',
    bottom: 50,
  },
});

export default SplashScreen;
