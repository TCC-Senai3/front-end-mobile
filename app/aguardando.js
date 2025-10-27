import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { getPin } from '../store/pinStore';
import { GameboyIcon } from '../components/icons/icon';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');

export default function Aguardando() {
  const router = useRouter();
  const code = getPin();
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/sala');
    }, 4000);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <CustomHeader showMenu={true} menuPosition="right" closeButtonSide="left" />
        <View style={styles.content}>
          <GameboyIcon style={styles.illustration} />
          <Text style={styles.title}>Aguardando o host da Sala</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>CODE: {code}</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#1CB0FC" />
              <Text style={styles.inputText}>Carregando...</Text>
            </View>
            <View style={styles.exitButtonWrapper}>
              <View style={styles.exitButtonShadow} />
              <TouchableOpacity style={styles.exitButton} onPress={() => router.replace('/game-pin')}>
                <Text style={styles.exitText}>SAIR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    // alignItems: 'center', // Removido para header não ser centralizado
  },
  header: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  code: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Blinker-Bold',
    textAlign: 'center',
    flex: 1,
  },
  illustration: {
    width: 320,
    height: 320,
    marginTop: 20,
  },
  title: {
    marginTop: 8,
    color: '#FFFFFF',
    fontFamily: 'Blinker-Bold',
    fontSize: 28,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  card: {
    width: '80%',
    maxWidth: 350,
    backgroundColor: '#DDDDDD',
    borderRadius: 16,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputPlaceholder: {
    width: 270,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B0B0AF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  inputText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.31)',
  },
  exitButtonWrapper: {
    position: 'relative',
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  exitButtonShadow: {
    position: 'absolute',
    width: 270,
    height: 42,
    left: 0,
    top: 0,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  exitButton: {
    width: 270,
    height: 42,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    fontFamily: 'Blinker',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    letterSpacing: 0.02,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  code: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Blinker-Bold',
    textAlign: 'center',
    flex: 1,
  },
});
