import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MedalhaIcon from '../components/icons/MedalhaIcon';

export default function RecompensaScreen() {
  const router = useRouter();
  const recompensa = 50;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>RECOMPENSAS</Text>

      <View style={styles.rewardRow}>
        <View style={styles.medalZoom}>
          <MedalhaIcon width={44} height={27} />
        </View>
        <Text style={styles.rewardValue}>{recompensa}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
        <Text style={styles.buttonLabel}>SAIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY_BLUE = '#03A9F4';
const BUTTON_COLOR = '#22D4F7';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 28,
    letterSpacing: 1,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },
  rewardValue: {
    fontSize: 38,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    marginLeft: 12,
  },
  button: {
    backgroundColor: BUTTON_COLOR,
    borderRadius: 8,
    width: 230,
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonLabel: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    fontSize: 22,
    letterSpacing: 1,
  },
  medalZoom: {
    transform: [{ scale: 1.8 }],
  },
});
