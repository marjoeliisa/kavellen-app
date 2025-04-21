import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function WalkScreen() {
  const [time, setTime] = useState(0);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [prevCoords, setPrevCoords] = useState<Location.LocationObjectCoords | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);

  // Ajastin
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Askelmittari
  useEffect(() => {
    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });
    return () => subscription.remove();
  }, []);

  // GPS-paikannus
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (loc) => {
          if (!isRunning) return;
          const coords = loc.coords;
          if (prevCoords) {
            const d = getDistance(
              prevCoords.latitude,
              prevCoords.longitude,
              coords.latitude,
              coords.longitude
            );
            setDistance((prev) => prev + d);
          }
          setPrevCoords(coords);
        }
      );
      locationSub.current = sub;
    })();

    return () => {
      if (locationSub.current) locationSub.current.remove();
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} min ${s < 10 ? '0' : ''}${s} s`;
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleEnd = () => {
    // Voit esim. tallentaa tulokset tai siirtyä yhteenvetonäkymään
    setIsRunning(false);
    setTime(0);
    setSteps(0);
    setDistance(0);
    setPrevCoords(null);
    alert('Kävely lopetettu!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Aika:</Text>
      <Text style={styles.value}>{formatTime(time)}</Text>

      <Text style={styles.label}>Askeleet:</Text>
      <Text style={styles.value}>{steps}</Text>

      <Text style={styles.label}>Matka:</Text>
      <Text style={styles.value}>{distance.toFixed(2)} km</Text>

      <View style={styles.buttonRow}>
        {isRunning ? (
          <TouchableOpacity style={styles.buttonAlt} onPress={handleStop}>
            <Text style={styles.buttonText}>Pysäytä</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonAlt} onPress={handleResume}>
            <Text style={styles.buttonText}>Jatka</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.buttonEnd} onPress={handleEnd}>
          <Text style={styles.buttonText}>Lopeta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 40, alignItems: 'center', backgroundColor: '#fff' },
  label: { fontSize: 20, fontWeight: '600', marginTop: 20 },
  value: { fontSize: 32, fontWeight: 'bold', color: '#8C52FF' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 20,
  },
  buttonAlt: {
    backgroundColor: '#f4c430',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonEnd: {
    backgroundColor: '#8C52FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
