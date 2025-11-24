import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as Location from "expo-location";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const App = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [accuration, setAccuration] = useState("");

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCOcIxTsIjaRkx0zoIE9UXJS83qO3b11rs",
    authDomain: "reactnativedoci.firebaseapp.com",
    databaseURL:
      "https://reactnativedoci-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "reactnativedoci",
    storageBucket: "reactnativedoci.firebasestorage.app",
    messagingSenderId: "1038280589257",
    appId: "1:1038280589257:web:206e2443725c1d5d90f218",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const createOneButtonAlert = () =>
    Alert.alert("Sukses", "Data berhasil disimpan", [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);

  // Get current location
  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const coords = location.coords.latitude + "," + location.coords.longitude;
    setLocation(coords);

    const accuracy = location.coords.accuracy;
    setAccuration(accuracy + " m");
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "white" }}>
      <SafeAreaView>
        <Stack.Screen options={{ title: "Form Input Location" }} />
        <Text style={styles.inputTitle}>Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan nama objek"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.inputTitle}>Koordinat</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan koordinat (contoh: -6.200000,106.816666)"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.inputTitle}>Accuration</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan accuration (contoh: 5 meter)"
          value={accuration}
          onChangeText={setAccuration}
        />
        <View style={styles.button}>
          <Button title="Get Current Location" onPress={getCoordinates} />
        </View>
        <View style={styles.button}>
          <Button
            title="Save"
            onPress={() => {
              const locationsRef = ref(db, "points/");
              push(locationsRef, {
                name: name,
                coordinates: location,
                accuration: accuration,
              })
                .then(() => {
                  createOneButtonAlert();
                  console.log("Berhasil menyimpan data ", locationsRef.key);
                  // clear form
                  setName("");
                  setLocation("");
                  setAccuration("");
                })
                .catch((e) => {
                  console.error("Error adding document: ", e);
                  Alert.alert("Error", "Gagal menyimpan data");
                });
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputTitle: {
    marginLeft: 12,
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    margin: 12,
  },
});

export default App;
