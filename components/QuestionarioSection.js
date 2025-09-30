// components/QuestionarioSection.js

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/JogoStyles';

// Dados de exemplo com as cores, para que tudo funcione
const quizzesData = [
    { 
      id: '1', 
      title: 'Hardware',
      description: '10 Questões | Valendo 100 Pontos',
    },
    { 
      id: '2', 
      title: 'Software',
      description: '10 Questões | Valendo 100 Pontos',
    },
    { 
      id: '3', 
      title: 'Redes',
      description: '10 Questões | Valendo 100 Pontos',
    },
    { 
      id: '4', 
      title: 'Segurança',
      description: '10 Questões | Valendo 100 Pontos',
    },
];

export default function QuestionarioSection() {
  const [searchText, setSearchText] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzesData);

  // Efeito que filtra a lista sempre que o texto da pesquisa muda
  useEffect(() => {
    if (searchText) {
      const newData = quizzesData.filter(item => {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = searchText.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredQuizzes(newData);
    } else {
      // Se a pesquisa estiver vazia, mostra a lista completa
      setFilteredQuizzes(quizzesData);
    }
  }, [searchText]);
  
  return (
    <View style={styles.questionarioFrame}>
      <Image
        source={require('../assets/images/Questionarios.svg')}
        style={styles.quizTitleBanner}
        resizeMode="contain"
      />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar questionário..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText} // Conectado ao state
        />
        <Image 
            source={require('../assets/images/busca.svg')}
            style={styles.searchIcon} 
        />
      </View>

      {/* Verifica se a lista de resultados está vazia */}
      {filteredQuizzes.length > 0 ? (
        <ScrollView style={styles.quizListContainer}>
          {/* A lista agora usa os dados filtrados */}
          {filteredQuizzes.map((quiz) => (
            <View key={quiz.id} style={[styles.quizCard]}>
              <Image
                  source={require('../assets/images/Rectangle 81.svg')}
                  style={styles.quizCardImage}
              />
              <View style={styles.quizCardTextContainer}>
                <Text style={[styles.quizCardTitle]}>
                  {quiz.title}
                </Text>
                <Text style={[styles.quizCardDescription]}>
                  {quiz.description}
                </Text>
                 <TouchableOpacity style={[styles.quizCardButton]}>
                    <Text style={styles.quizCardButtonText}>Iniciar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.searchEmptyContainer}>
          <Text style={styles.searchEmptyText}>Nenhum questionário encontrado</Text>
        </View>
      )}

    </View>
  );
}