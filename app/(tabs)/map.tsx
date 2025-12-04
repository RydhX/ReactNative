import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, ImageBackground, Linking, Alert, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// --- Type Definition ---
interface Location {
  id: string;
  name: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  createdAt?: string;
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

// --- HTML Generator for Leaflet Map ---
const generateMapHTML = (markers: Location[]) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background-color: #1d2c4d; }
            .leaflet-popup-content-wrapper, .leaflet-popup-tip {
                background: #0c0a19;
                color: #fff;
                border: 1px solid #8a2be2;
            }
            .leaflet-popup-content-wrapper a { color: #c3a6ff; }
            .leaflet-popup-content h4 { margin: 0 0 5px; }
            .leaflet-popup-content p { margin: 0; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            const map = L.map('map').setView([-7.795, 110.369], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const markersData = ${JSON.stringify(markers)};
            
            markersData.forEach(markerData => {
                const marker = L.marker([markerData.coordinate.latitude, markerData.coordinate.longitude]).addTo(map);
                marker.bindPopup("<h4>" + markerData.name + "</h4><p>" + markerData.description + "</p>");
                marker.on('click', () => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'marker_press',
                        payload: markerData
                    }));
                });
            });

            map.on('click', function(e) {
                const { lat, lng } = e.latlng;
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'map_press',
                    latitude: lat,
                    longitude: lng
                }));
            });
        </script>
    </body>
    </html>
    `;
};


export default function MapScreen() {
  const router = useRouter();
  const [markers, setMarkers] = useState<Location[]>([]);

  useEffect(() => {
    const locationsRef = ref(db, 'locations');
    onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMarkers: Location[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMarkers(loadedMarkers);
      } else {
        setMarkers([]);
      }
    });
  }, []);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'map_press') {
            router.push({
                pathname: '/forminputlocation',
                params: { latitude: data.latitude, longitude: data.longitude }
            });
        } else if (data.type === 'marker_press') {
            handleMarkerPress(data.payload);
        }
    } catch (error) {
        console.error("Error parsing message from WebView", error);
    }
  };

  const handleMarkerPress = (marker: Location) => {
    const { latitude, longitude } = marker.coordinate;
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const latLng = `${latitude},${longitude}`;
    const label = marker.name;
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;

    Linking.openURL(url).catch(err => Alert.alert("Gagal Membuka Peta", "Pastikan aplikasi peta terinstall di perangkat Anda."));
  };
  
  const mapHtml = useMemo(() => generateMapHTML(markers), [markers]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80' }} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.15 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Peta Titik Melamun</Text>
        </View>

        <BlurView intensity={20} tint="dark" style={styles.infoPanel}>
            <Text style={styles.infoText}>Menampilkan {markers.length} titik. Tekan area di peta untuk menambah titik baru.</Text>
        </BlurView>

        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            onMessage={handleWebViewMessage}
            style={styles.webview}
          />
        </View>

        <TouchableOpacity style={styles.fab} onPress={() => router.push('/location')}>
            <FontAwesome5 name="list-ul" size={20} color="#fff" style={{marginRight: 10}} />
            <Text style={styles.fabText}>Lihat Daftar Lokasi</Text>
        </TouchableOpacity>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c0a19',
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(224, 170, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  infoPanel: {
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    overflow: 'hidden',
  },
  infoText: {
    color: '#d1d1d1',
    fontSize: 14,
    textAlign: 'center',
  },
  mapContainer: {
    width: '100%',
    height: '70%', 
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.4)',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0c0a19',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8a2be2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },
  fabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
