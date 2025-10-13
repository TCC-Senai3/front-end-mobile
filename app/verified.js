import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image } from 'react-native';
import { Stack } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');

export default function Verified() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.screenContainer}>
        <CustomHeader title="" showMenu={true} menuPosition="right" />
        <View style={styles.content}>
          <Image
            source={require('../assets/images/verified.svg')}
            style={styles.verifiedImage}
            resizeMode="contain"
          />

          <Text style={styles.correctText}>CORRETO!</Text>
        </View>
        {/* Home bar */}
        <View style={styles.homeBarWrapper}>
          <View style={styles.homeBar} />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    justifyContent: 'flex-start',
  },
  verifiedImage: {
    marginTop: -40, // igual ao erro
    width: 200,
    height: 200,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 8,
  },
  correctText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 30,
    lineHeight: 45,
    textAlign: 'center',
    letterSpacing: 0.32,
    textTransform: 'uppercase',
  },
  homeBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 13,
  },
  homeBar: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
