import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Modal } from "react-native";
import { useState } from "react";
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'luonto':
        return require('../../assets/images/icon-luonto.png');
      case 'kaupunki':
        return require('../../assets/images/icon-kaupunki.png');
      case 'meditatiivinen':
        return require('../../assets/images/icon-meditaatio.png');
      case 'ystävä':
        return require('../../assets/images/icon-ystava.png');
      case 'vaellus':
        return require('../../assets/images/icon-vaellus.png');
      case 'arki':
        return require('../../assets/images/icon-arki.png');
      default:
        return require('../../assets/images/icon-luonto.png');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/map-bg.png')}
        style={styles.header}
        resizeMode="cover"
      >

    <View style={styles.mottoContainer}>
      <Text style={styles.motto}>“Et tarvitse hyvää fiilistä.{"\n"}Tarvitset kengät.”</Text>
    </View>      
    </ImageBackground>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>ALOITA KÄVELY</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Valitse kävelytyyppi</Text>

            <View style={styles.grid}>
              {['luonto', 'kaupunki', 'meditatiivinen', 'ystävä', 'vaellus', 'arki'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.walkType,
                    selectedType === type && styles.selectedWalkType,
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Image source={getIcon(type)} style={{ width: 50, height: 50 }} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setModalVisible(false);
                  router.push('/walk');
                  // tässä voisi siirtyä seuraavaan näkymään tai aloittaa seurannan
                }}
              >
                <Text style={styles.buttonText}>Aloita</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ marginTop: 10 }}>Peru</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  logo: { fontSize: 100, color: "#8C52FF", fontWeight: "bold" },
  title: { fontSize: 32, fontWeight: "bold", color: "#8C52FF", marginTop: -10 },
  motto: { marginTop: 10, fontSize: 14, textAlign: "center", color: "#2a2a2a" },
  bottom: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    backgroundColor: "#8C52FF",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 999,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  walkType: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  selectedWalkType: {
    backgroundColor: '#D1C4E9',
  },
  modalButtons: {
    marginTop: 20,
    alignItems: 'center',
  },

  mottoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  motto: {
    color: '#8C52FF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  }
  
});
