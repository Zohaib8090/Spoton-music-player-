
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageColors from 'react-native-image-colors';

const MiniPlayer = ({ song, onPlayPause, onSkipNext, onSkipPrevious, onCast, onPress, isPlaying }) => {
  const [backgroundColor, setBackgroundColor] = useState('#2C2C2E');

  useEffect(() => {
    if (song && song.artwork) {
      ImageColors.getColors(song.artwork, { fallback: '#2C2C2E' }).then((colors) => {
        setBackgroundColor(colors.darkVibrant || colors.darkMuted || colors.dominant || '#2C2C2E');
      });
    }
  }, [song]);

  if (!song) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor }]}>
        <Image source={{ uri: song.artwork }} style={styles.albumArt} />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.artistName}>{song.artist}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={onCast}>
            <Ionicons name="cast" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkipPrevious}>
            <Ionicons name="play-skip-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPause}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkipNext}>
            <Ionicons name="play-skip-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 50, // Adjust this value to position the player above the tab bar
    left: 0,
    right: 0,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  songInfo: {
    flex: 1,
    marginLeft: 10,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    color: '#A9A9A9',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 150,
  },
});

export default MiniPlayer;
