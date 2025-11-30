// components/QuestionarioSection.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../styles/JogoStyles';
import QuestionariosBannerIcon from '../components/icons/QuestionariosBannerIcon';
import BuscaIcon from '../components/icons/BuscaIcon';

import { getQuestionarios } from '../services/formulariosService';

export default function QuestionarioSection() {
  const [searchText, setSearchText] = useState('');
  const [quizzes, setQuizzes] = useState([]);               // ← dados da API
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Carregar dados da API
  useEffect(() => {
    carregarQuestionarios();
  }, []);

  const carregarQuestionarios = async () => {
    try {
      const data = await getQuestionarios();

      // Transformar o formato da API → formato usado na tela
      const listaFormatada = data.map((form) => ({
        id: form.idFormulario,
        title: form.titulo,
        description: `${form.perguntas.length} questões`,
      }));

      setQuizzes(listaFormatada);
      setFilteredQuizzes(listaFormatada);

    } catch (error) {
      console.error("Erro ao carregar questionários:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Filtro de pesquisa
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredQuizzes(quizzes);
      return;
    }

    const texto = searchText.toUpperCase();

    const filtrados = quizzes.filter(q =>
      q.title.toUpperCase().includes(texto)
    );

    setFilteredQuizzes(filtrados);
  }, [searchText, quizzes]);

  // Quando clicar no card
  const handleStartQuiz = (quizTitle) => {
    console.log(`Iniciando o quiz: ${quizTitle}`);
  };

  return (
    <View style={styles.questionarioFrame}>

      <QuestionariosBannerIcon style={styles.quizTitleBanner} />

      {/* Campo de Busca */}
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

      {/* LOADING */}
      {loading && (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      )}

      {/* LISTA */}
      {!loading && (
        <View style={{ flex: 1 }}>
          {filteredQuizzes.length > 0 ? (
            <ScrollView
              style={styles.quizListContainer}
              nestedScrollEnabled={true}
            >
              {filteredQuizzes.map((quiz) => (
                <TouchableOpacity
                  key={quiz.id}
                  style={styles.quizCard}
                  onPress={() => handleStartQuiz(quiz.title)}
                  activeOpacity={0.7}
                >
                  <View style={styles.quizCardTextContainer}>
                    <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                    <Text style={styles.quizCardDescription}>{quiz.description}</Text>
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
      )}
    </View>
  );
}
