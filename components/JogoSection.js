// components/JogoSection.js

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '../styles/JogoStyles'; // Usaremos o novo estilo unificado
import MedalhaIcon from '../components/icons/MedalhaIcon';
import OndasIcon from '../components/icons/OndasIcon';
import AddIcon from '../components/icons/AddIcon';
import LivroIcon from '../components/icons/LivroIcon';


const { width } = Dimensions.get('window');

const cardData = [
  { title: 'CRIAR SALA', subtitle: 'Crie uma sala para você e seus amigos', type: 'criar-sala', buttonText: 'CRIAR' },
  { title: 'SALA PRIVADA', subtitle: 'Divirta-se com seus colegas de classe', type: 'sala-privada', buttonText: 'ENTRAR' },
];

// O seu código original de JogoScreen, agora como um componente exportável
export default function JogoSection() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = width * 0.75 + (width - width * 0.75);

  const handleNext = () => {
    if (activeIndex < cardData.length - 1) {
      const newIndex = activeIndex + 1;
      scrollRef.current.scrollTo({ x: newIndex * cardWidth, animated: true });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      scrollRef.current.scrollTo({ x: (activeIndex - 1) * cardWidth, animated: true });
    }
  };

  return (
    // Esta View substitui o <View style={styles.container}> do seu código original
    <View> 
        <View style={styles.waveContainer}>
            <OndasIcon style={styles.waveImage} />
            <View style={styles.appTitleContainer}>
                <Text style={styles.appTitleSenai}>SENAI</Text>
                <Text style={styles.appTitleSkillUp}>SKILL UP</Text>
            </View>
        </View>
        <View style={styles.carouselArea}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(event) => {
                    const slide = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
                    if (slide !== activeIndex) {
                        setActiveIndex(slide);
                    }
                }}
                contentContainerStyle={styles.carouselContainer}
                scrollEventThrottle={16}
            >
                {cardData.map((card, index) => (
                    <View key={index} style={[styles.card, card.type === 'sala-privada' && styles.cardPrivada]}>
                        <View style={styles.cardTextContent}>
                            <Text style={[styles.cardTitle, card.type === 'sala-privada' && styles.cardPrivadaTitle]}>{card.title}</Text>
                            <Text style={[styles.cardSubtitle, card.type === 'sala-privada' && styles.cardPrivadaSubtitle]}>{card.subtitle}</Text>
                        </View>
                          {card.type === 'criar-sala' && (<AddIcon style={styles.cardIconImage} />)}
                        {card.type === 'sala-privada' && (<LivroIcon style={styles.cardLivrosImage} />)}
                        <TouchableOpacity style={[styles.cardButton, card.type === 'sala-privada' && styles.buttonPrivada]}>
                            <Text style={styles.cardButtonText}>{card.buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            {activeIndex > 0 && (<TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={handlePrev}><Feather name="chevron-left" size={40} color="#000" /></TouchableOpacity>)}
            {activeIndex < cardData.length - 1 && (<TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={handleNext}><Feather name="chevron-right" size={40} color="#000" /></TouchableOpacity>)}
        </View>
    </View>
  );
}