// app/index.js
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Senai Skill Up!</Text>
      <Link href="/contato" style={styles.link}>Contato</Link>
      <Link href="/suporte" style={styles.link}>Suporte</Link>
      <Link href="/termos" style={styles.link}>Termos</Link>
     <Link href="/jogo" style={styles.link}>jogo</Link>
      <Link href="/home" style={styles.link}>home</Link>
      <Link href="/perfil" style={styles.link}>perfil</Link>
      <Link href="/sala" style={styles.link}>sala</Link>
      <Link href="/game-pin" style={styles.link}>game-pin</Link>
      <Link href="/verified" style={styles.link}>verified</Link>
     <Link href="/error" style={styles.link}>error</Link>
      <Link href="/aguardando" style={styles.link}>aguardando</Link>








    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  link: { fontSize: 18, color: '#007BFF', marginVertical: 10 },
});