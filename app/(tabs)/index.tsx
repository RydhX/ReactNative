import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0c0a19', '#1a1a2e']}
        style={styles.container}
      >
        {/* Glow background */}
        <View style={styles.glowCircle} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>VOID</Text>
          <Text style={styles.subtitle}>Temukan Titik Melamun di Yogyakarta</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          VOID adalah portal untuk menemukan ruang-ruang tenang di tengah hiruk pikuk Yogyakarta. 
          Jelajahi lokasi-lokasi dengan energi “cosmic vibe”—tempat sempurna untuk melamun, 
          merenung, dan menyatu dengan semesta.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/map')}>
            <Text style={styles.buttonText}>Buka Peta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => router.push('/location')}>
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Daftar Lokasi</Text>
          </TouchableOpacity>
        </View>
        
        {/* Divider */}
        <View style={styles.neonDivider} />


        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <InfoCard icon="map-marker-alt" title="Total Titik Melamun" value="42" />
          <InfoCard icon="layer-group" title="Area Tercover" value="Seluruh DIY" />
          <InfoCard icon="satellite-dish" title="Cosmic Vibe" value="98%" />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Enter the Void</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function InfoCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <FontAwesome5 name={icon} size={24} color="#e0e0e0" />
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c0a19',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  glowCircle: {
    position: 'absolute',
    top: -100,
    width: 400,
    height: 400,
    borderRadius: 400,
    backgroundColor: 'rgba(74, 4, 128, 0.3)',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#c3a6ff',
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: '#d1d1d1',
    textAlign: 'center',
    lineHeight: 22,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#8a2be2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8a2be2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutlineText: {
    color: '#8a2be2',
    fontWeight: 'bold',
  },
  neonDivider: {
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(138, 43, 226, 0.5)',
    marginTop: 30,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    borderRadius: 15,
    padding: 15,
    width: 110,
    height: 110,
    justifyContent: 'center',
  },
  infoTitle: {
    color: '#c3a6ff',
    marginTop: 6,
    fontSize: 12,
  },
  infoValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#4a3d6e',
    fontStyle: 'italic',
  },
});
