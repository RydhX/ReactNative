import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDatabase, ref, push, set, update } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { FontAwesome5 } from '@expo/vector-icons';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// --- Firebase Config (No Changes) ---
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

// --- HTML & JavaScript for Leaflet Map in WebView (with types) ---
const generateMapHTML = (initialLat?: number | string, initialLng?: number | string) => {
    const lat = initialLat !== undefined ? parseFloat(String(initialLat)) : null;
    const lng = initialLng !== undefined ? parseFloat(String(initialLng)) : null;

    const initialCoordsExist = lat !== null && lng !== null;
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background-color: #1d2c4d;}
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            const initialLat = ${lat ?? -7.795};
            const initialLng = ${lng ?? 110.369};
            const initialZoom = ${initialCoordsExist ? 16 : 12};

            const map = L.map('map').setView([initialLat, initialLng], initialZoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            let marker;

            function updateMarker(lat, lng) {
                if (marker) {
                    marker.setLatLng([lat, lng]);
                } else {
                    marker = L.marker([lat, lng]).addTo(map);
                }
                map.setView([lat, lng], map.getZoom());
            }

            if (${initialCoordsExist}) {
                updateMarker(initialLat, initialLng);
            }

            map.on('click', function(e) {
                const { lat, lng } = e.latlng;
                updateMarker(lat, lng);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'pick',
                    latitude: lat,
                    longitude: lng
                }));
            });
        </script>
    </body>
    </html>
    `;
};

export default function FormInputLocationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [locationId, setLocationId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const webViewRef = useRef<WebView>(null);
    
    useEffect(() => {
        const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
        const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
        const descParam = Array.isArray(params.description) ? params.description[0] : params.description;
        const latParam = Array.isArray(params.latitude) ? params.latitude[0] : params.latitude;
        const lonParam = Array.isArray(params.longitude) ? params.longitude[0] : params.longitude;

        if (idParam) {
            setIsEditMode(true);
            setLocationId(idParam);
            setName(nameParam || '');
            setDescription(descParam || '');
            if (latParam) setLatitude(latParam);
            if (lonParam) setLongitude(lonParam);
        } else {
             if (latParam) setLatitude(latParam);
             if (lonParam) setLongitude(lonParam);
        }
    }, [params]);

    const handleMapMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'pick') {
                setLatitude(data.latitude.toString());
                setLongitude(data.longitude.toString());
            }
        } catch (error) {
            console.error("Error parsing message from WebView", error);
        }
    };
    
    const resetForm = () => {
        setName('');
        setDescription('');
        setLatitude('');
        setLongitude('');
        setIsEditMode(false);
        setLocationId(null);
        // Reload webview to reset map state
        webViewRef.current?.reload();
        // Clear router params by replacing the current route with a clean one
        router.replace('/forminputlocation');
    };

    const handleSubmit = async () => {
        if (!name || !description || !latitude || !longitude) {
            Alert.alert('Error', 'Nama, deskripsi, dan titik di peta harus diisi.');
            return;
        }
        setIsLoading(true);
        const locationData = {
            name: name,
            description: description,
            coordinate: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        };
        try {
            if (isEditMode && locationId) {
                const locationRef = ref(db, `locations/${locationId}`);
                await update(locationRef, locationData);
                Alert.alert('Sukses', 'Titik melamun berhasil diperbarui!', [{ text: 'OK', onPress: resetForm }]);
            } else {
                const newLocationRef = push(ref(db, 'locations'));
                await set(newLocationRef, { ...locationData, createdAt: new Date().toISOString() });
                Alert.alert('Sukses', 'Titik melamun baru berhasil ditambahkan!', [{ text: 'OK', onPress: resetForm }]);
            }
        } catch (error) {
            console.error("Firebase Error:", error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan data.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const mapHtml = generateMapHTML(params.latitude, params.longitude);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#0c0a19', '#1a1a2e']} style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.header}>
                            <FontAwesome5 name={isEditMode ? "pen-alt" : "crosshairs"} size={40} color="#fff" />
                            <Text style={styles.title}>{isEditMode ? 'Edit Titik Melamun' : 'Tambah Titik Melamun Baru'}</Text>
                            <Text style={styles.subtitle}>{isEditMode ? 'Perbarui detail atau pindah titik di peta' : 'Tekan peta untuk memilih lokasi'}</Text>
                        </View>
                        
                        <View style={styles.mapViewContainer}>
                            <WebView
                                ref={webViewRef}
                                source={{ html: mapHtml }}
                                onMessage={handleMapMessage}
                                style={styles.webview}
                                scrollEnabled={false}
                                originWhitelist={['*']}
                            />
                        </View>

                        <View style={styles.coordsDisplay}>
                            <Text style={styles.coordText}>Lat: {latitude || '...'}</Text>
                            <Text style={styles.coordText}>Lon: {longitude || '...'}</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nama Lokasi</Text>
                            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Contoh: Taman Sunyi di Tengah Kota" placeholderTextColor="#888"/>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Deskripsi Singkat</Text>
                            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Jelaskan suasana dan 'vibe' di lokasi ini..." placeholderTextColor="#888" multiline/>
                        </View>
                        
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
                            <Text style={styles.submitButtonText}>{isLoading ? 'Menyimpan...' : (isEditMode ? 'Perbarui Lokasi' : 'Simpan Titik Melamun')}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0c0a19' },
    container: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 15, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#c3a6ff', marginTop: 5, textAlign: 'center' },
    mapViewContainer: { height: 250, width: '100%', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(138, 43, 226, 0.5)', marginBottom: 15 },
    webview: { flex: 1 },
    coordsDisplay: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(26, 26, 46, 0.9)', borderRadius: 10, padding: 10, marginBottom: 20 },
    coordText: { color: '#fff', fontSize: 16, fontFamily: 'monospace' },
    inputContainer: { width: '100%', marginBottom: 15 },
    label: { color: '#d1d1d1', fontSize: 16, marginBottom: 8 },
    input: { backgroundColor: 'rgba(26, 26, 46, 0.9)', color: '#fff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(138, 43, 226, 0.5)', fontSize: 16 },
    textArea: { height: 80, textAlignVertical: 'top' },
    submitButton: { width: '100%', backgroundColor: '#8a2be2', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
