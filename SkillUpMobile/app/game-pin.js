import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

const { height } = Dimensions.get('window');

export default function GamePinScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A84FF" />

        <CustomHeader title="" showMenu={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../assets/images/imagem-onda-azul.png')}
          style={styles.headerBackground}
          resizeMode="cover">
          <View style={styles.headerContent}>
            <Text style={styles.logoTextSenai}></Text>
            <Text style={styles.logoTextSkillUp}></Text>
          </View>
        </ImageBackground>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <TextInput
              style={styles.pinInput}
              placeholder="PIN do jogo"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity style={styles.enterButton}>
              <Text style={styles.enterButtonText}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navButtonPlaceholder} />
        <View style={styles.navButtonPlaceholder} />
        <View style={styles.navButtonPlaceholder} />
      </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerBackground: {
    width: '100%',
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  logoTextSenai: {
    fontFamily: 'Poppins-Bold',
    fontSize: 50,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  logoTextSkillUp: {
    fontFamily: 'Poppins-Medium',
    fontSize: 50,
    color: '#FFFFFF',
    marginTop: -15,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  backButton: {
    display: 'none',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  card: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  pinInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  enterButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#009DFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  bottomNav: {
    width: '100%',
    height: 85,
    backgroundColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#DCDCDC',
  },
  navButtonPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#C8C8C8',
    borderRadius: 10,
  },
});