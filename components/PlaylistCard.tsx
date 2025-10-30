
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PlaylistCard = ({ playlist }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={playlist.image} style={styles.image} />
      <Text style={styles.title}>{playlist.title}</Text>
      <Text style={styles.description}>{playlist.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 15,
    width: 160,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#A9A9A9',
    fontSize: 14,
  },
});

export default PlaylistCard;
