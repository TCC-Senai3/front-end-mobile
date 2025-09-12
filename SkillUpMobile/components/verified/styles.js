import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export const ScreenContainer = ({ children }) => (
  <View style={styles.screenContainer}>{children}</View>
);

export const TopBar = ({ children }) => (
  <View style={styles.topBar}>{children}</View>
);

export const FlexGrow = () => <View style={{ flexGrow: 1 }} />;

export const MenuIcon = () => <Feather name="menu" size={32} color="#FFFFFF" />;

export const VerifiedIcon = () => (
  <Ionicons name="checkmark-circle" size={120} color="#34C759" style={{ marginTop: 40 }} />
);

export const CorrectText = ({ children }) => (
  <Text style={styles.correctText}>{children}</Text>
);

export const HomeIndicator = () => <View style={styles.homeIndicator} />;

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
  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CFCFCF',
  },
});


