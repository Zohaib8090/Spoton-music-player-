
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { YOUTUBE_API_KEY } from '@/config/streaming-services';

const ArtistScreen = () => {
  const { artistName } = useLocalSearchParams();
  const [artist, setArtist] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [fromLibrary, setFromLibrary] = useState([]);

  useEffect(() => {
    if (artistName) {
      fetchArtistData();
    }
  }, [artistName]);

  const fetchArtistData = async () => {
    try {
      // Fetch artist details
      const artistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          artistName as string
        )}&type=channel&maxResults=1&key=${YOUTUBE_API_KEY}`
      );
      const artistData = await artistResponse.json();
      if (artistData.items && artistData.items.length > 0) {
        const channel = artistData.items[0];
        setArtist({
          id: channel.id.channelId,
          name: channel.snippet.title,
          thumbnail: channel.snippet.thumbnails.high.url,
        });

        // Fetch top songs (playlist)
        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id.channelId}&order=viewCount&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
        );
        const playlistData = await playlistResponse.json();
        if (playlistData.items) {
          setTopSongs(
            playlistData.items.map((item) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              artist: item.snippet.channelTitle,
              artwork: item.snippet.thumbnails.high.url,
            }))
          );
        }

        // Fetch albums
        const albumsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id.channelId}&q=album&type=playlist&maxResults=5&key=${YOUTUBE_API_KEY}`
        );
        const albumsData = await albumsResponse.json();
        if (albumsData.items) {
            setAlbums(
                albumsData.items.map((item) => ({
                    id: item.id.playlistId,
                    title: item.snippet.title,
                    artwork: item.snippet.thumbnails.high.url,
                }))
            );
        }

        // Fetch singles
        const singlesResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id.channelId}&q=single&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
        );
        const singlesData = await singlesResponse.json();
        if (singlesData.items) {
            setSingles(
                singlesData.items.map((item) => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    artwork: item.snippet.thumbnails.high.url,
                }))
            );
        }

        // Fetch videos
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id.channelId}&type=video&maxResults=5&order=date&key=${YOUTUBE_API_KEY}`
        );
        const videosData = await videosResponse.json();
        if (videosData.items) {
            setVideos(
                videosData.items.map((item) => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    views: '0', // Placeholder
                    artwork: item.snippet.thumbnails.high.url,
                }))
            );
        }

        // Placeholder for library songs
        setFromLibrary([
            {
                id: '1',
                title: 'Left Right',
                artist: 'Ali Sethi, Abdullah Siddiqui, Maanu',
                artwork: 'https://i.ytimg.com/vi/1q234567890/hqdefault.jpg',
            },
            {
                id: '2',
                title: 'Jhol - Acoustic',
                artist: 'Maanu, Annural Khalid, Asfand & A...',
                artwork: 'https://i.ytimg.com/vi/0987654321/hqdefault.jpg',
            },
            {
                id: '3',
                title: 'Jhol',
                artist: 'Maanu & Annural Khalid',
                artwork: 'https://i.ytimg.com/vi/1122334455/hqdefault.jpg',
            },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Image source={{ uri: item.artwork }} style={styles.songArtwork} />
      <View style={styles.songDetails}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songPlays}>No. 39 globally this week</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderAlbumItem = ({ item }) => (
    <View style={styles.albumItem}>
      <Image source={{ uri: item.artwork }} style={styles.albumArtwork} />
      <Text style={styles.albumTitle}>{item.title}</Text>
      <Text style={styles.albumYear}>2025</Text>
    </View>
  );

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoItem}>
        <Image source={{ uri: item.artwork }} style={styles.videoArtwork} />
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoViews}>{item.views} views</Text>
    </View>
  );

  if (!artist) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={{ uri: artist.thumbnail }} style={styles.header}>
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity style={{marginRight: 10}}>
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.monthlyAudience}>136M monthly audience</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeButtonText}>Subscribed 185K</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top songs</Text>
          <TouchableOpacity style={styles.playAllButton}>
            <Text style={styles.playAllButtonText}>Play all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={topSongs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Albums</Text>
        <FlatList
          data={albums}
          renderItem={renderAlbumItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Singles and EPs</Text>
        <FlatList
          data={singles}
          renderItem={renderAlbumItem} // Re-using album item styling
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Videos</Text>
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
        
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>From your library</Text>
        <FlatList
          data={fromLibrary}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  header: {
    height: 300,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: -150,
    left: 15,
    right: 15,
  },
  artistName: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  monthlyAudience: {
    color: 'white',
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  subscribeButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  subscribeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  section: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playAllButton: {
    borderColor: 'white',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  playAllButtonText: {
    color: 'white',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  songArtwork: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  songDetails: {
    flex: 1,
    marginLeft: 10,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
  },
  songPlays: {
    color: '#A9A9A9',
    fontSize: 12,
  },
  albumItem: {
    marginRight: 15,
    width: 150,
  },
  albumArtwork: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  albumTitle: {
    color: 'white',
    marginTop: 5,
  },
  albumYear: {
    color: '#A9A9A9',
  },
  videoItem: {
    marginRight: 15,
    width: 250,
  },
  videoArtwork: {
    width: 250,
    height: 140,
    borderRadius: 10,
  },
  videoTitle: {
    color: 'white',
    marginTop: 5,
  },
  videoViews: {
    color: '#A9A9A9',
  },
});

export default ArtistScreen;
