import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TouchableOpacity, Linking } from "react-native";


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

export default function LokasiScreen() {
  const [sections, setSections] = useState<{ title: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editCoordinates, setEditCoordinates] = useState("");

  const handleViewMap = (coordinates: string) => {
    const [latitude, longitude] = coordinates
      .split(",")
      .map((coord) => coord.trim());
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleDelete = (itemId: string, itemName: string) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus lokasi "${itemName}"?`,
      [
        { text: "Batal", onPress: () => {}, style: "cancel" },
        {
          text: "Hapus",
          onPress: async () => {
            try {
              const pointRef = ref(db, `points/${itemId}`);
              await remove(pointRef);
              Alert.alert("Sukses", "Lokasi berhasil dihapus");
            } catch (error) {
              console.error("Error deleting location:", error);
              Alert.alert("Error", "Gagal menghapus lokasi");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEditPress = (item: any) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCoordinates(item.coordinates);
    setEditModalVisible(true);
  };

  const validateCoordinates = (coords: string): boolean => {
    const pattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    return pattern.test(coords.trim());
  };

  const handleUpdateLocation = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Nama lokasi tidak boleh kosong");
      return;
    }

    if (!validateCoordinates(editCoordinates)) {
      Alert.alert(
        "Error",
        "Format koordinat tidak valid. Gunakan format: latitude,longitude (contoh: -6.123,106.456)"
      );
      return;
    }

    try {
      const pointRef = ref(db, `points/${editingItem.id}`);
      await update(pointRef, {
        name: editName.trim(),
        coordinates: editCoordinates.trim(),
      });
      setEditModalVisible(false);
      Alert.alert("Sukses", "Lokasi berhasil diperbarui");
    } catch (error) {
      console.error("Error updating location:", error);
      Alert.alert("Error", "Gagal memperbarui lokasi");
    }
  };

  useEffect(() => {
    const pointsRef = ref(db, "points/");

    // Listen for data changes
    const unsubscribe = onValue(
      pointsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Transform the Firebase object into an array
          const pointsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // Format for SectionList
          const formattedData = [
            {
              title: "Lokasi Tersimpan",
              data: pointsArray,
            },
          ];
          setSections(formattedData);
        } else {
          setSections([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Since Firebase provides real-time data, we can simulate a refresh
    // for UX purposes. A real data refetch isn't strictly necessary unless
    // you want to force a re-read from the server.
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemContent}>
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <ThemedText style={styles.coordinates}>{item.coordinates}</ThemedText>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(item)}
                >
                  <ThemedText style={styles.buttonText}>✏️ Edit</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewMap(item.coordinates)}
                >
                  <ThemedText style={styles.buttonText}>📍 View</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <ThemedText style={styles.buttonText}>🗑️ Hapus</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={styles.header}>{title}</ThemedText>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
        </ThemedView>
      )}

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Edit Lokasi</ThemedText>

            <ThemedText style={styles.label}>Nama Lokasi</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Nama lokasi"
              placeholderTextColor="#999"
              value={editName}
              onChangeText={setEditName}
            />

            <ThemedText style={styles.label}>Koordinat (lat,lng)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Contoh: -6.123,106.456"
              placeholderTextColor="#999"
              value={editCoordinates}
              onChangeText={setEditCoordinates}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <ThemedText style={styles.buttonText}>Batal</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateLocation}
              >
                <ThemedText style={styles.buttonText}>Simpan</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#a7dcffff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    color: "#666",
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#ffc107",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButton: {
    backgroundColor: "#0275d8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#000000ff",
    color: "#ffffffff",
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#000",
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
