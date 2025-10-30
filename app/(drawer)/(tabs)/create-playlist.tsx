
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreatePlaylistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Playlist</Text>
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
  text: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default CreatePlaylistScreen;
