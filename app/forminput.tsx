import React, { useState } from "react";
import { StyleSheet, TextInput, Button, View, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FormInputScreen = () => {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [kelas, setKelas] = useState("");

  const handleSave = () => {
    Alert.alert("Data Saved", `Nama: ${nama}\nNIM: ${nim}\nKelas: ${kelas}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNama}
          value={nama}
          placeholder="Nama"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>NIM</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNim}
          value={nim}
          placeholder="NIM"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Kelas</Text>
        <TextInput
          style={styles.input}
          onChangeText={setKelas}
          value={kelas}
          placeholder="Kelas"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default FormInputScreen;
