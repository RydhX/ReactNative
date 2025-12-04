import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';

// --- Type Definition ---
interface Location {
  id: string;
  name: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  createdAt: string; // From Firebase
}

// --- Firebase Config ---
const firebaseConfig = {
    apiKey: "AIzaSyCOcIxTsIjaRkx0zoIE9UXJS83qO3b11rs",
    authDomain: "reactnativedoci.firebaseapp.com",
    databaseURL: "https://reactnativedoci-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "reactnativedoci",
    storageBucket: "reactnativedoci.firebasestorage.app",
    messagingSenderId: "1038280589257",
    appId: "1:1038280589257:web:206e2443725c1d5d90f218",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
const db = getDatabase(app);

const icons = ['🔮', '🌌', '✨'];

const FilterTabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
    const tabs = ["Semua", "Favorit", "Terdekat"];
    return (
        <View style={styles.filterContainer}>
            {tabs.map(tab => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                    <Text style={[styles.filterText, activeTab === tab && styles.filterActive]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const LocationCard = ({ item, index, onEdit, onDelete }: { item: Location, index: number, onEdit: (item: Location) => void, onDelete: (id: string) => void }) => (
    <BlurView intensity={25} tint="dark" style={styles.card}>
        <Text style={styles.cardIcon}>{icons[index % icons.length]}</Text>
        <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardCoords}>Koordinat: {item.coordinate.latitude.toFixed(4)}, {item.coordinate.longitude.toFixed(4)}</Text>
        </View>
        <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionButton}>
                <FontAwesome5 name="edit" size={16} color="#c3a6ff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionButton}>
                <FontAwesome5 name="trash-alt" size={16} color="#ff7b7b" />
            </TouchableOpacity>
        </View>
    </BlurView>
);

export default function LocationScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const locationsRef = ref(db, 'locations');
    onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedLocations: Location[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setLocations(loadedLocations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setLocations([]);
      }
    });
  }, []);

  useEffect(() => {
    let result = locations;
    if (searchQuery) {
        result = locations.filter(loc => 
            loc.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    setFilteredLocations(result);
  }, [searchQuery, locations]);

  const handleEdit = (item: Location) => {
    router.push({
        pathname: '/forminputlocation',
        params: {
            id: item.id,
            name: item.name,
            description: item.description,
            latitude: item.coordinate.latitude,
            longitude: item.coordinate.longitude
        }
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
        "Konfirmasi Hapus",
        "Anda yakin ingin menghapus titik melamun ini?",
        [
            { text: "Batal", style: "cancel" },
            { 
                text: "Hapus", 
                style: "destructive", 
                onPress: () => {
                    const locationRef = ref(db, `locations/${id}`);
                    remove(locationRef)
                        .then(() => Alert.alert("Sukses", "Lokasi telah dihapus."))
                        .catch((error) => Alert.alert("Gagal", "Gagal menghapus lokasi: " + error.message));
                }
            }
        ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0c0a19', '#1a1a2e']} style={styles.container}>
        <View style={styles.glowCircle} />
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Daftar Titik Melamun</Text>
                <Text style={styles.subtitle}>Lokasi-lokasi cosmic di sekitar Yogyakarta</Text>
            </View>

            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={16} color="#8a2be2" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari nama lokasi..."
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <View style={styles.listSection}>
                <FlatList
                    data={filteredLocations}
                    renderItem={({ item, index }) => 
                        <LocationCard 
                            item={item} 
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    }
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={{height: 15}}/>}
                    ListEmptyComponent={<Text style={styles.emptyListText}>Belum ada titik melamun yang ditambahkan.</Text>}
                />
            </View>
        </ScrollView>

        <TouchableOpacity style={styles.mapButton} onPress={() => router.push('/map')}>
            <Text style={styles.mapButtonText}>Lihat Semua di Peta</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0c0a19' },
  container: { flex: 1, paddingHorizontal: 20 },
  glowCircle: {
    position: 'absolute',
    top: -50,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(74, 4, 128, 0.25)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#c3a6ff',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 10,
    padding: 5,
  },
  filterText: {
    color: '#aaa',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  filterActive: {
    color: '#fff',
    backgroundColor: '#8a2be2',
    borderRadius: 8,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  listSection: {
      paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.2)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 30,
    marginRight: 15,
    alignSelf: 'center'
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#d1d1d1',
    marginTop: 4,
  },
  cardCoords: {
    fontSize: 12,
    color: '#8a2be2',
    marginTop: 8,
    fontFamily: 'monospace'
  },
  cardActions: {
      flexDirection: 'column',
      marginLeft: 10,
  },
  actionButton: {
      padding: 8,
  },
  mapButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#8a2be2',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyListText: {
      color: '#aaa',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
  },
});
