
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Ionicons, Feather } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Spoton</Text>
      </View>

      <TouchableOpacity
        style={[styles.drawerItem, pathname === '/' ? styles.drawerItemActive : {}]}
        onPress={() => router.push('/(drawer)')}
      >
        <Ionicons name="home-outline" size={20} color="white" />
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, pathname === '/profile' ? styles.drawerItemActive : {}]}
        onPress={() => router.push('/(drawer)/profile')}
      >
        <Ionicons name="person-outline" size={20} color="white" />
        <Text style={styles.drawerItemText}>View Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, pathname === '/whats-new' ? styles.drawerItemActive : {}]}
        onPress={() => router.push('/(drawer)/whats-new')}
      >
        <Ionicons name="notifications-outline" size={20} color="white" />
        <Text style={styles.drawerItemText}>What's new</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, pathname === '/settings' ? styles.drawerItemActive : {}]}
        onPress={() => router.push('/(drawer)/settings')}
      >
        <Ionicons name="settings-outline" size={20} color="white" />
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.drawerItem} onPress={signOut}>
          <Feather name="log-out" size={20} color="white" />
          <Text style={styles.drawerItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DrawerLayout = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: '75%', backgroundColor: '#000' } }}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="profile" />
      <Drawer.Screen name="whats-new" />
      <Drawer.Screen name="settings" />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  drawerItemActive: {
    backgroundColor: '#333',
  },
  drawerItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
});

export default DrawerLayout;
