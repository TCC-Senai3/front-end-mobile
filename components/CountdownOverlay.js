import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CountdownOverlay({ segundos = 3, onComplete }) {
  const [count, setCount] = useState(segundos);

  useEffect(() => {
    if (count === 0) {
      onComplete && onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count]);

  if (count === 0) return null;

  return (
    <View style={styles.overlay}>
      <Text style={styles.text}>Prepare-se...</Text>
      <Text style={styles.number}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
  },
  number: {
    fontSize: 100,
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
