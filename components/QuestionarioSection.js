// components/QuestionarioSection.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/JogoStyles';
import QuestionariosBannerIcon from '../components/icons/QuestionariosBannerIcon';
import BuscaIcon from '../components/icons/BuscaIcon';
import QuizCardIcon from '../components/icons/QuizCardIcon';

// Dados de exemplo
const quizzesData = [
    { id: '1', title: 'Hardware', description: '10 Questões | Valendo 100 Pontos' },
    { id: '2', title: 'Software', description: '10 Questões | Valendo 100 Pontos' },
    { id: '3', title: 'Redes', description: '10 Questões | Valendo 100 Pontos' },
    { id: '4', title: 'Segurança', description: '10 Questões | Valendo 100 Pontos' },
    { id: '5', title: 'Backend', description: '10 Questões | Valendo 100 Pontos' },
    { id: '6', title: 'Frontend', description: '10 Questões | Valendo 100 Pontos' },
];

export default function QuestionarioSection() {
  const [searchText, setSearchText] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzesData);

  useEffect(() => {
    if (searchText) {
      const newData = quizzesData.filter(item => {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = searchText.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredQuizzes(newData);
    } else {
      setFilteredQuizzes(quizzesData);
    }
  }, [searchText]);
  
  return (
    <View style={styles.questionarioFrame}>
      <QuestionariosBannerIcon style={styles.quizTitleBanner} />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar questionário..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <BuscaIcon style={styles.searchIcon} />
      </View>

      {/* Usamos a View com flex: 1 para garantir o espaço correto */}
      <View style={{ flex: 1 }}>
        {filteredQuizzes.length > 0 ? (
          // E adicionamos a propriedade nestedScrollEnabled={true} aqui
          <ScrollView 
            style={styles.quizListContainer} 
            nestedScrollEnabled={true}
          >
            {filteredQuizzes.map((quiz) => (
              <View key={quiz.id} style={[styles.quizCard]}>
                <QuizCardIcon
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
    </View>
  );
}