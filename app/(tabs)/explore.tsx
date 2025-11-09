import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const Tab = createMaterialTopTabNavigator();

function Tab1Screen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>This is Tab 1</ThemedText>
    </ThemedView>
  );
}

function Tab2Screen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>This is Tab 2</ThemedText>
    </ThemedView>
  );
}

export default function ExploreScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Tab 1" component={Tab1Screen} />
        <Tab.Screen name="Tab 2" component={Tab2Screen} />
      </Tab.Navigator>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <ThemedText>Beranda</ThemedText>
              </TouchableOpacity>
            </Link>
            <Link href="/mahasiswa" asChild>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <ThemedText>Mahasiswa</ThemedText>
              </TouchableOpacity>
            </Link>
            <Link href="/forminput" asChild>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <ThemedText>Form Input</ThemedText>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <ThemedText style={styles.textStyle}>Hide Modal</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <IconSymbol size={32} color="#ffffffff" name="plus" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#0275d8',
    borderRadius: 30,
    elevation: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});