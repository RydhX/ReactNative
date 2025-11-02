import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFCB00', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/shell_logo.png')}
          style={styles.reactLogo}
        />
      }
    >
  <ThemedView style={{ paddingHorizontal: 8, marginTop: 10 }}>
        {/* Selamat Datang removed as requested */}
  <ThemedText style={{ marginTop: 12, fontWeight: 'bold', fontSize: 23, textAlign: 'left' }}>Nama</ThemedText>
  <ThemedText style={{ fontSize: 20, textAlign: 'left', marginTop: 2, fontWeight: '600', marginBottom: 10 }}>Ridho Alif Utama</ThemedText>
  <ThemedText style={{ marginTop: 12, fontWeight: 'bold', fontSize: 23, textAlign: 'left' }}>NIM</ThemedText>
  <ThemedText style={{ fontSize: 20, textAlign: 'left', marginTop: 2, fontWeight: '600', marginBottom: 10 }}>23/518259/SV/22935</ThemedText>
  <ThemedText style={{ marginTop: 12, fontWeight: 'bold', fontSize: 23, textAlign: 'left' }}>Kelas</ThemedText>
  <ThemedText style={{ fontSize: 20, textAlign: 'left', marginTop: 2, fontWeight: '600', marginBottom: 10 }}>PGPBL A</ThemedText>
  <ThemedText style={{ marginTop: 12, fontWeight: 'bold', fontSize: 23, textAlign: 'left' }}>Mata Kuliah</ThemedText>
  <ThemedText style={{ fontSize: 20, textAlign: 'left', marginTop: 2, fontWeight: '600', marginBottom: 10 }}>Pemrograman Geospasial Perangkat Bergerak Lanjut</ThemedText>
  <ThemedText style={{ marginTop: 12, fontWeight: 'bold', fontSize: 23, textAlign: 'left' }}>Aplikasi</ThemedText>
  <ThemedText style={{ fontSize: 20, textAlign: 'left', marginTop: 2, fontWeight: '600', marginBottom: 10 }}>Aplikasi ini dijalankan di perangkat IOS</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 120,
    width: 195,
  },
});
