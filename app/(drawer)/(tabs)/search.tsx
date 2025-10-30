
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Voice from '@react-native-voice/voice';
import { useAuth } from '@/context/AuthContext';
import { database } from '@/config/firebase-config';
import { ref, onValue, off, push, set } from 'firebase/database';
import Search from '@/components/Search';
import { YOUTUBE_API_KEY } from '@/config/streaming-services';

const SearchScreen = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchSource, setSearchSource] = useState('YT MUSIC');
  const [searchFilter, setSearchFilter] = useState('Songs');

  const searchHistoryRef = user ? ref(database, `searchHistory/${user.uid}`) : null;

  useEffect(() => {
    if (searchHistoryRef) {
      onValue(searchHistoryRef, (snapshot) => {
        const data = snapshot.val();
        setSearchHistory(data ? Object.values(data) as string[] : []);
      });

      return () => off(searchHistoryRef);
    }
  }, [searchHistoryRef]);

  const handleSearch = async () => {
    if (searchQuery.trim() !== '' && searchHistoryRef) {
      const newHistoryItemRef = push(searchHistoryRef);
      set(newHistoryItemRef, searchQuery);
    }

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    if (searchSource === 'LIBRARY') {
      console.log('Searching in library...');
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          `${searchQuery} ${searchFilter}`
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

  const handleDeleteHistoryItem = (item: string) => {
    if (searchHistoryRef) {
        const itemRef = ref(database, `searchHistory/${user.uid}/${item}`);
        set(itemRef, null);
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  Voice.onSpeechResults = (e) => {
    if (e.value) {
      setSearchQuery(e.value[0]);
    }
  };

  Voice.onSpeechEnd = () => {
    setIsListening(false);
  };
  
  const handleSave = (song) => {
    // Implement save to playlist functionality here
    console.log('Saved song:', song.title);
  };

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => setSearchQuery(item)}
    >
      <MaterialIcons name="history" size={24} color="#A9A9A9" />
      <Text style={styles.historyItemText}>{item}</Text>
      <TouchableOpacity onPress={() => handleDeleteHistoryItem(item)}>
        <Ionicons name="close" size={24} color="#A9A9A9" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            placeholderTextColor="#A9A9A9"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.micIcon} onPress={isListening ? stopListening : startListening}>
            <Ionicons name="mic" size={24} color={isListening ? '#A78BFA' : 'white'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

        <View style={styles.tabsContainer}>
            <TouchableOpacity 
                style={searchSource === 'YT MUSIC' ? styles.activeTab : styles.tab} 
                onPress={() => setSearchSource('YT MUSIC')}
            >
            <Text style={searchSource === 'YT MUSIC' ? styles.activeTabText : styles.tabText}>YT MUSIC</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={searchSource === 'LIBRARY' ? styles.activeTab : styles.tab} 
                onPress={() => setSearchSource('LIBRARY')}
            >
            <Text style={searchSource === 'LIBRARY' ? styles.activeTabText : styles.tabText}>LIBRARY</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
            <TouchableOpacity 
                style={searchFilter === 'Songs' ? styles.activeFilterButton : styles.filterButton} 
                onPress={() => setSearchFilter('Songs')}
            >
                <Text style={searchFilter === 'Songs' ? styles.activeFilterButtonText : styles.filterButtonText}>Songs</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={searchFilter === 'Videos' ? styles.activeFilterButton : styles.filterButton} 
                onPress={() => setSearchFilter('Videos')}
            >
                <Text style={searchFilter === 'Videos' ? styles.activeFilterButtonText : styles.filterButtonText}>Videos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={searchFilter === 'Artists' ? styles.activeFilterButton : styles.filterButton} 
                onPress={() => setSearchFilter('Artists')}
            >
                <Text style={searchFilter === 'Artists' ? styles.activeFilterButtonText : styles.filterButtonText}>Artists</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={searchFilter === 'Albums' ? styles.activeFilterButton : styles.filterButton} 
                onPress={() => setSearchFilter('Albums')}
            >
                <Text style={searchFilter === 'Albums' ? styles.activeFilterButtonText : styles.filterButtonText}>Albums</Text>
            </TouchableOpacity>
      </View>

      {searchResults.length > 0 ? (
        <Search searchResults={searchResults} onSave={handleSave} />
      ) : (
        <FlatList
          data={searchHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          style={styles.historyList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 40, // for status bar
    paddingBottom: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 25,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 15,
    color: 'white',
  },
  micIcon: {
    padding: 8,
  },
  historyList: {
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  historyItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
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
