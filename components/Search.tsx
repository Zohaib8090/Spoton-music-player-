
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const SearchResultItem = ({ song, isFirst, onPlay, onSave }) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: song.artwork }} style={styles.itemArtwork} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{song.title}</Text>
        <Text style={styles.itemArtist}>{song.artist}</Text>
        {isFirst && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.playButton} onPress={() => onPlay(song)}>
              <Ionicons name="play" size={20} color="black" />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={() => onSave(song)}>
              <MaterialCommunityIcons name="playlist-plus" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const Search = ({ searchResults, onPlay, onSave }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={({ item, index }) => (
          <SearchResultItem
            song={item}
            isFirst={index === 0}
            onPlay={onPlay}
            onSave={onSave}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemArtwork: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemArtist: {
    color: '#A9A9A9',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  playButtonText: {
    color: 'black',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 10,
  },
});

export default Search;
