import React from 'react';
import { StyleSheet, SectionList, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { Collapsible } from '@/components/ui/collapsible';

const DATA = [
  {
    title: 'Asisten',
    data: [
      { nama: 'Asbil', nim: '12345', kelas: 'A' },
      { nama: 'Budi', nim: '67890', kelas: 'B' },
      { nama: 'Charlie', nim: '13579', kelas: 'A' },
      { nama: 'David', nim: '24680', kelas: 'B' },
    ],
  },
  {
    title: 'Mahasiswa Kelas A',
    data: [
      { nama: 'Cindy', nim: '11111', kelas: 'A' },
      { nama: 'Dina', nim: '22222', kelas: 'A' },
      { nama: 'Evi', nim: '33333', kelas: 'A' },
      { nama: 'Fara', nim: '44444', kelas: 'A' },
      { nama: 'Gita', nim: '55555', kelas: 'A' },
      { nama: 'Hana', nim: '66666', kelas: 'A' },
      { nama: 'Intan', nim: '77777', kelas: 'A' },
      { nama: 'Jasmine', nim: '88888', kelas: 'A' },
    ],
  },
  {
    title: 'Mahasiswa Kelas B',
    data: [
      { nama: 'Dono', nim: '44444', kelas: 'B' },
      { nama: 'Kasino', nim: '55555', kelas: 'B' },
      { nama: 'Indro', nim: '66666', kelas: 'B' },
      { nama: 'Karim', nim: '77777', kelas: 'B' },
      { nama: 'Lutfi', nim: '88888', kelas: 'B' },
      { nama: 'Mega', nim: '99999', kelas: 'B' },
      { nama: 'Nadia', nim: '10101', kelas: 'B' },
      { nama: 'Omar', nim: '12121', kelas: 'B' },
    ],
  },
];

const MahasiswaScreen = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title" style={styles.pageTitle}>Daftar Hadir Praktikum</ThemedText>
    <SectionList
      sections={DATA}
      keyExtractor={(item, index) => item.nama + index}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Collapsible title={item.nama}>
            <ThemedText>NIM: {item.nim}</ThemedText>
            <ThemedText>Kelas: {item.kelas}</ThemedText>
          </Collapsible>
        </View>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <ThemedText type="defaultSemiBold" style={styles.header}>{title}</ThemedText>
      )}
      SectionSeparatorComponent={() => <View style={{ height: 16 }} />}
    />
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  pageTitle: {
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 12,
    fontSize: 26,
    fontFamily: Fonts.rounded,
  },
  item: {
    padding: 16,
    marginVertical: 2,
    borderRadius: 8,
  },
  header: {
    fontSize: 24,
    fontFamily: Fonts.sans,
    marginBottom: 0,
    backgroundColor: '#FFC107',
    padding: 8,
    borderRadius: 8,
    color: 'black',
    overflow: 'hidden',
  },
});

export default MahasiswaScreen;
