
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Search from '@/components/Search';
import { YOUTUBE_API_KEY } from '@/config/streaming-services';
import TrackPlayer from 'react-native-track-player';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      return;
    }
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          searchQuery
        )}&type=video&maxResults=20&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (data.items) {
        const songs = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          artwork: item.snippet.thumbnails.high.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));
        setSearchResults(songs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlay = async (song) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(song);
    TrackPlayer.play();
  };

  const handleSave = (song) => {
    // Implement save to playlist functionality here
    console.log('Saved song:', song.title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => console.log('Go back')}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search" 
          placeholderTextColor="#A9A9A9"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Voice search')}>
            <Ionicons name="mic" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Filter')}>
            <Ionicons name="options" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>YT MUSIC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>LIBRARY</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.activeFilterButton}>
            <Text style={styles.activeFilterButtonText}>Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Albums</Text>
        </TouchableOpacity>
      </View>

      <Search searchResults={searchResults} onPlay={handlePlay} onSave={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    marginHorizontal: 10
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  tab: {
    paddingHorizontal: 20,
  },
  activeTab: {
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#A9A9A9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonText: {
    color: 'white',
  },
  activeFilterButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButtonText: {
    color: 'black',
  },
});

export default SearchScreen;
