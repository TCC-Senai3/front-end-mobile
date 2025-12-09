
import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.root}>
      <StatusBar translucent={false} backgroundColor="#0D0D0D" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Bem-vindo ao Senai Skill Up!</Text>

        <Link href="/login" style={styles.link}>Login</Link>
        <Link href="/cadastro" style={styles.link}>Cadastro</Link>
        <Link href="/contato" style={styles.link}>Contato</Link>
        <Link href="/suporte" style={styles.link}>Suporte</Link>
        <Link href="/termos" style={styles.link}>Termos</Link>
        <Link href="/jogo" style={styles.link}>Jogo</Link>
        <Link href="/Recuperacao-Email" style={styles.link}>Recuperação de Email</Link>
        <Link href="/Sem-Conexao" style={styles.link}>Sem Conexão</Link>
        <Link href="/home" style={styles.link}>Home</Link>
        <Link href="/perfil" style={styles.link}>Perfil</Link>
        <Link href="/sala" style={styles.link}>Sala</Link>
        <Link href="/game-pin" style={styles.link}>Game PIN</Link>
        <Link href="/verified" style={styles.link}>Verificado</Link>
        <Link href="/error" style={styles.link}>Erro</Link>
        <Link href="/criar-sala" style={styles.link}>Criar Sala</Link>
        <Link href="/partida" style={styles.link}>Partida</Link>
        <Link href="/fim-de-jogo" style={styles.link}>Fim de Jogo</Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0D0D', // cor de fundo global
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    fontSize: 18,
    color: '#f50606',
    marginVertical: 10,
  },
});
