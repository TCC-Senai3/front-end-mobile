// components/QuestionarioSection.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router'; // Importar router se for navegar
import styles from '../styles/JogoStyles';
import QuestionariosBannerIcon from '../components/icons/QuestionariosBannerIcon';
import BuscaIcon from '../components/icons/BuscaIcon';

// Importando o serviço que acabamos de criar
import { getQuestionarios } from '../services/formulariosService';

export default function QuestionarioSection() {
  const [searchText, setSearchText] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter(); // Hook para navegação

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
        // Proteção: usa '?.' e '|| 0' caso o array perguntas venha nulo
        description: `${form.perguntas?.length || 0} questões`,
      }));

      setQuizzes(listaFormatada);
      setFilteredQuizzes(listaFormatada);

    } catch (error) {
      console.error("Erro ao carregar questionários:", error);
      // Opcional: Alert.alert("Erro", "Não foi possível carregar a lista.");
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
  const handleStartQuiz = (quizId, quizTitle) => {
    console.log(`Iniciando o quiz ID: ${quizId} - ${quizTitle}`);
    
    // EXEMPLO DE NAVEGAÇÃO:
    // router.push({ pathname: '/sala', params: { id: quizId, nome: quizTitle } });
    // ou
    // router.push(`/quiz/${quizId}`);
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
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#00A9FF" style={{ marginTop: 20 }} />
        </View>
      ) : (
        /* LISTA */
        <View style={{ flex: 1 }}>
          {filteredQuizzes.length > 0 ? (
            <ScrollView
              style={styles.quizListContainer}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {filteredQuizzes.map((quiz) => (
                <TouchableOpacity
                  key={quiz.id}
                  style={styles.quizCard}
                  onPress={() => handleStartQuiz(quiz.id, quiz.title)}
                  activeOpacity={0.7}
                >
                  <View style={styles.quizCardTextContainer}>
                    <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                    <Text style={styles.quizCardDescription}>{quiz.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {/* Espaço extra no final para não cortar o último item */}
              <View style={{ height: 20 }} />
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