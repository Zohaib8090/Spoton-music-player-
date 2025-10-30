
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PlaylistCard from '@/components/PlaylistCard';

const HomeScreen = () => {
  const [playlists, setPlaylists] = useState([]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="library-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Personalized Recommendations</Text>

      <View style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <MaterialCommunityIcons name="flare" size={24} color="white" />
          <Text style={styles.recommendationTitle}>Personalized Suggestions</Text>
        </View>
        <Text style={styles.recommendationText}>
          Our AI will recommend songs based on your listening history. The more you listen, the better the recommendations.
        </Text>
      </View>

      <TouchableOpacity style={styles.recommendationButton}>
        <MaterialCommunityIcons name="flare" size={20} color="white" style={{ marginRight: 5 }} />
        <Text style={styles.recommendationButtonText}>Get Fresh Recommendations</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.title}>Playlists</Text>

      {playlists.length === 0 ? (
        <View style={styles.noPlaylistsContainer}>
          <Text style={styles.noPlaylistsText}>No playlist created yet</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recommendationCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  recommendationText: {
    color: '#A9A9A9',
    fontSize: 16,
  },
  recommendationButton: {
    backgroundColor: '#A78BFA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  recommendationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 20,
  },
  noPlaylistsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  noPlaylistsText: {
    color: '#A9A9A9',
    fontSize: 16,
  },
});

export default HomeScreen;
