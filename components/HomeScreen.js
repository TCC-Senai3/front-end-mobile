import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topBar}>
        <View style={{ flexGrow: 1 }} />
        <Feather name="menu" size={32} color="#FFFFFF" />
      </View>

      <Ionicons name="checkmark-circle" size={120} color="#34C759" style={{ marginTop: 40 }} />

      <Text style={styles.correctText}>Correto!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    height: 97,
    backgroundColor: '#00A9FF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingBottom: 10,
  },
  correctText: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '700',
    color: '#2B2B2B',
  },
});

export default HomeScreen;
