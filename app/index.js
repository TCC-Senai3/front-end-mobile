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
      <Link href="/Redefinicao-Senha" style={styles.link}>nova-Senha</Link>
      <Link href="/Recuperacao-Email" style={styles.link}>Recuperação-Email</Link>
      <Link href="/Sem-Conexao" style={styles.link}>Sem-Conexão</Link>
      <Link href="/home" style={styles.link}>home</Link>
      <Link href="/perfil" style={styles.link}>perfil</Link>
      <Link href="/sala" style={styles.link}>sala</Link>
      <Link href="/game-pin" style={styles.link}>game-pin</Link>
      <Link href="/verified" style={styles.link}>verified</Link>
      <Link href="/error" style={styles.link}>error</Link>
      <Link href="/aguardando" style={styles.link}>aguardando</Link>
      <Link href="/criar-sala" style={styles.link}>Criar-sala</Link>
      <Link href="/partida" style={styles.link}>Partida</Link>
      <Link href="/fim-de-jogo" style={styles.link}>Fim de jogo</Link>
      <Link href="/recompensa" style={styles.link}>Recompensa</Link>
      <Link href="/buscar" style={styles.link}>Buscar</Link>








    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  link: { fontSize: 18, color: '#007BFF', marginVertical: 10 },
});