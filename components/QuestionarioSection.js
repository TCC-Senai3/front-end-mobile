// components/QuestionarioSection.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/JogoStyles';
import { QuestionariosBannerIcon, BuscaIcon } from './icons/icon';
// O QuizCardIcon não é mais necessário aqui, já que a imagem foi removida do seu layout original
// import QuizCardIcon from '../components/icons/QuizCardIcon'; 

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
  
  // Função que será chamada ao clicar no card
  const handleStartQuiz = (quizTitle) => {
    // AQUI você adicionará a lógica para navegar para a tela do quiz
    console.log(`Iniciando o quiz: ${quizTitle}`);
    // Exemplo de como seria com navegação (você precisará do hook useNavigation):
    // navigation.navigate('TelaDoQuiz', { quizId: quiz.id });
  };

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

      <View style={{ flex: 1 }}>
        {filteredQuizzes.length > 0 ? (
          <ScrollView 
            style={styles.quizListContainer} 
            nestedScrollEnabled={true}
          >
            {filteredQuizzes.map((quiz) => (
              // --- ALTERAÇÃO AQUI ---
              // O <View> virou um <TouchableOpacity>
              <TouchableOpacity 
                key={quiz.id} 
                style={[styles.quizCard]}
                onPress={() => handleStartQuiz(quiz.title)} // Ação de clique adicionada
                activeOpacity={0.7} // Efeito visual ao clicar
              >
                <View style={styles.quizCardTextContainer}>
                  <Text style={[styles.quizCardTitle]}>
                    {quiz.title}
                  </Text>
                  <Text style={[styles.quizCardDescription]}>
                    {quiz.description}
                  </Text>
                </View>
              </TouchableOpacity>
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