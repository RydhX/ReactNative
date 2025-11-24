import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyCOcIxTsIjaRkx0zoIE9UXJS83qO3b11rs',
  authDomain: 'reactnativedoci.firebaseapp.com',
  databaseURL:
    'https://reactnativedoci-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'reactnativedoci',
  storageBucket: 'reactnativedoci.firebasestorage.app',
  messagingSenderId: '1038280589257',
  appId: '1:1038280589257:web:206e2443725c1d5d90f218',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function MapScreen() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const pointsRef = ref(db, 'points/');

    const unsubscribe = onValue(
      pointsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const pointsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setLocations(pointsArray);
          generateMapHTML(pointsArray);
        } else {
          setLocations([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching locations:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const generateMapHTML = (locs: any[]) => {
    if (locs.length === 0) return;

    // Calculate center
    const latSum = locs.reduce((sum, loc) => {
      const [lat] = loc.coordinates.split(',').map((c: string) => parseFloat(c.trim()));
      return sum + lat;
    }, 0);
    const lngSum = locs.reduce((sum, loc) => {
      const [, lng] = loc.coordinates.split(',').map((c: string) => parseFloat(c.trim()));
      return sum + lng;
    }, 0);

    const centerLat = latSum / locs.length;
    const centerLng = lngSum / locs.length;

    // Create markers HTML
    const markers = locs
      .map((loc) => {
        const [lat, lng] = loc.coordinates
          .split(',')
          .map((c: string) => parseFloat(c.trim()));
        return `
        L.marker([${lat}, ${lng}])
          .addTo(map)
          .bindPopup('<strong>${loc.name}</strong><br/>${loc.coordinates}');
      `;
      })
      .join('\n');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        body { width: 100%; height: 100vh; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${centerLat}, ${centerLng}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        ${markers}
      </script>
    </body>
    </html>
    `;

    setHtmlContent(html);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (locations.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>Tidak ada lokasi untuk ditampilkan di peta.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webView}
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
  },
});
