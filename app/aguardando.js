import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

export default function Aguardando() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <CustomHeader title="" showMenu={true} menuPosition="right" edgePadding={0} rightOffset={160} />

        <Image source={require('../assets/images/gameboy.png')} style={styles.illustration} resizeMode="contain" />

        <Text style={styles.title}>Aguardando o host da Sala</Text>

        <View style={styles.card}>
          <View style={styles.inputPlaceholder}>
            <Text style={styles.inputText}>Carregando...</Text>
          </View>

          <View style={styles.exitButtonWrapper}>
            <View style={styles.exitButtonShadow} />
            <TouchableOpacity style={styles.exitButton} onPress={() => router.replace('/game-pin')}>
              <Text style={styles.exitText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.homeIndicator} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    alignItems: 'center',
  },
  illustration: {
    width: 260,
    height: 260,
    marginTop: 70,
  },
  title: {
    marginTop: 16,
    color: '#FFFFFF',
    fontFamily: 'Blinker-Bold',
    fontSize: 32,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  card: {
    width: '86%',
    maxWidth: 360,
    backgroundColor: '#DDDDDD',
    borderRadius: 16,
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  inputPlaceholder: {
    height: 64,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  inputText: {
    color: '#B0B0B0',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  exitButtonWrapper: {
    position: 'relative',
  },
  exitButtonShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 8,
    marginHorizontal: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#C10000',
  },
  exitButton: {
    height: 64,
    borderRadius: 10,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 180,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 100,
  },
});
