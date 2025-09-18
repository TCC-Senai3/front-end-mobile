import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Stack } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

export default function Error() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.screenContainer}>
        <CustomHeader title="" showMenu={true} menuPosition="right" edgePadding={0} rightOffset={160} />

      <Image
        source={require('../assets/images/cancel.png')}
        style={styles.cancelImage}
        resizeMode="contain"
      />

      <Text style={styles.errorText}>ERRADO!</Text>

      <View style={styles.homeIndicator} />
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#00A9FF',
    alignItems: 'center',
    paddingTop: 0,
  },
  cancelImage: {
    width: 200,
    height: 200,
    marginTop: 160,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.32,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 100,
    alignSelf: 'center',
  },
});
