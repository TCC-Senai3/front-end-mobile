import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Link } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import { SvgUri } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const featureSections = [
    {
      icon: { uri: 'https://c.animaapp.com/mesh3yq5uHbvsH/img/trophy-1.png' },
      title: 'Desafie-se',
      description:
        'O Senai Skill Up é um jogo de perguntas e respostas que torna o aprendizado no SENAI mais dinâmico. Os alunos testam conhecimentos, competem e interagem com professores de forma divertida!',
    },
    {
      icon: { uri: 'https://c.animaapp.com/mesh3yq5uHbvsH/img/game-controller-1.png' },
      title: 'Divirta-se',
      description:
        'O jogo conta com dois modos de gameplay: normal, com perguntas livres ou salas de professores, e multiplayer, com competição, ranking e cartas de ajuda.',
    },
    {
      icon: { uri: 'https://c.animaapp.com/mesh3yq5uHbvsH/img/question-1.svg' },
      isSvg: true,
      title: 'Proposito',
      description:
        'A proposta do nosso projeto é criar um jogo online interativo que visa transformar o processo de aprendizagem em uma experiência mais divertida, dinâmica e envolvente.',
    },
    {
      icon: { uri: 'https://c.animaapp.com/mesh3yq5uHbvsH/img/people-group--1--1.png' },
      title: 'Quem nós somos',
      description:
        'Somos alunos de TI desenvolvendo este projeto para aplicar nossos conhecimentos e criar uma solução inovadora que torne o aprendizado mais envolvente e divertido.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00A9FF" />
      <CustomHeader title="" showMenu={true} showSearch={false} menuPosition="left" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HERO com fundo azul e ilustração */}
        <View style={styles.heroWrapper}>
            <Image
              source={require('../assets/images/hero-illustration.svg')}
              style={[styles.heroImage, { width: width * 0.95, height: (width * 0.95) * (223.03/359) }]}
              resizeMode="contain"
            />
          <View style={styles.heroTexts}>
            <View style={styles.heroTitleRow}>
              <Text style={[styles.heroTitle, styles.heroTitleBold]}>SENAI</Text>
              <Text style={styles.heroTitle}> SKILL–UP</Text>
            </View>
            <Text style={styles.heroSubtitle}>
              Desafie-se jogando o nosso{'\n'}
              jogo de perguntas exclusivo{'\n'}
              para os cursos do{'\n'}
              <Text style={styles.heroSubtitleBold}>SENAI</Text>
            </Text>
          </View>
          <Link href="/game-pin" asChild>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Entrar</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* SEÇÕES */}
        <View style={styles.sections}>
          {featureSections.map((s, idx) => (
            <View key={idx} style={styles.sectionCard}>
              {s.isSvg ? (
                <SvgUri uri={s.icon.uri} width={68} height={68} />
              ) : (
                <Image source={s.icon} style={styles.sectionIcon} />
              )}
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionDesc}>{s.description}</Text>
            </View>
          ))}
        </View>

        {/* BLOCO PERGUNTAS */}
        <View style={styles.faqCard}>
          <ImageBackground
            source={{ uri: 'https://c.animaapp.com/mesh3yq5uHbvsH/img/fundo.png' }}
            style={styles.faqBg}
            resizeMode="contain"
          >
            {/* Balão branco superior direito */}
            <View style={styles.whiteBubble}>
              <View style={styles.whiteBubbleLines} />
              <View style={styles.whiteBubbleLines} />
              <View style={styles.whiteBubbleLines} />
              <View style={styles.whiteBubbleTail} />
            </View>

            {/* Balão azul inferior direito */}
            <View style={styles.blueBubble}>
              <View style={styles.blueBubbleLineTop} />
              <View style={styles.blueBubbleLineMid} />
              <View style={styles.blueBubbleLineBot} />
              <View style={styles.blueBubbleTail} />
            </View>

            <View style={styles.faqTextBox}>
              <Text style={styles.faqTitle}>PERGUNTAS?</Text>
              <Text style={styles.faqSubtitle}>Vamos conversar!</Text>
              <Link href="/contato" asChild>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contato</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#00A9FF' },
  scrollContent: { backgroundColor: '#FFFFFF', paddingBottom: 24 },

  // HERO
  heroWrapper: {
    backgroundColor: '#2E96F1',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroImage: { width: width * 0.6, height: width * 0.6, marginTop: 40 },
  heroTexts: { alignItems: 'center', marginTop: 24, paddingHorizontal: 24 },
  heroTitleRow: { flexDirection: 'row', alignItems: 'baseline' },
  heroTitle: { color: '#FFFFFF', fontSize: 32, fontFamily: 'Poppins-Medium' },
  heroTitleBold: { fontFamily: 'Blinker-Bold', fontSize: 36 },
  heroSubtitle: { color: '#FFFFFF', textAlign: 'center', marginTop: 12, lineHeight: 22, fontFamily: 'Poppins-Regular' },
  heroSubtitleBold: { fontFamily: 'Poppins-SemiBold' },
  ctaButton: { backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 36, borderRadius: 15, marginTop: 20 },
  ctaButtonText: { color: '#00ABFF', fontSize: 20, fontFamily: 'Poppins-SemiBold' },

  // SEÇÕES
  sections: { paddingHorizontal: 28, paddingTop: 32 },
  sectionCard: { alignItems: 'center', marginBottom: 28 },
  sectionIcon: { width: 68, height: 68, marginBottom: 10 },
  sectionTitle: { fontSize: 18, color: '#2F2E2E', fontFamily: 'Blinker-Bold', marginBottom: 6 },
  sectionDesc: { color: '#3B3939', textAlign: 'justify', lineHeight: 22, fontFamily: 'Poppins-Medium' },

  // FAQ card
  faqCard: { paddingHorizontal: 16, paddingVertical: 16 },
  faqBg: { width: '100%', aspectRatio: 360 / 334.8, justifyContent: 'center' },
  faqTextBox: { position: 'absolute', left: 32, top: '42%', width: 200 },
  faqTitle: { color: '#2F2E2E', fontSize: 28, fontFamily: 'Poppins-SemiBold', textTransform: 'uppercase', lineHeight: 34 },
  faqSubtitle: { color: '#2F2E2E', fontSize: 18, fontFamily: 'Poppins-Medium', marginBottom: 10 },
  contactButton: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 9, alignSelf: 'flex-start' },
  contactButtonText: { color: '#00ABFF', fontFamily: 'Poppins-SemiBold' },

  // White bubble (top-right) per provided CSS
  whiteBubble: {
    position: 'absolute',
    right: 18,
    top: 36,
    width: 150,
    height: 90,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  whiteBubbleLines: {
    height: 5,
    backgroundColor: '#787878',
    borderRadius: 3,
    marginBottom: 10,
    width: '60%',
    alignSelf: 'center',
  },
  whiteBubbleTail: {
    position: 'absolute',
    left: 20,
    bottom: -20,
    width: 0,
    height: 0,
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderTopWidth: 20,
    borderTopColor: '#f0f0f0',
  },
  // optional small border/shadow edge for white tail
  whiteBubbleTailBorder: {
    position: 'absolute',
    left: -13.5,
    bottom: -2.5,
    width: 0,
    height: 0,
    borderRightWidth: 13.5,
    borderRightColor: 'rgba(0,0,0,0.3)',
    borderTopWidth: 13.5,
    borderTopColor: 'transparent',
  },

  // Blue bubble (bottom-right) per provided CSS
  blueBubble: {
    position: 'absolute',
    right: 18,
    bottom: 42,
    width: 150,
    height: 90,
    backgroundColor: '#00ABFF',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  blueBubbleLineTop: {
    width: '60%',
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 12,
  },
  blueBubbleLineMid: {
    width: '60%',
    height: 5,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginBottom: 12,
  },
  blueBubbleLineBot: {
    width: '60%',
    height: 5,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
  },
  blueBubbleTail: {
    position: 'absolute',
    right: 20,
    bottom: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: '#00ABFF',
    borderBottomWidth: 20,
    borderBottomColor: 'transparent',
  },
});
