import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFonts } from 'expo-font';
import styles from '../styles/CadastroStyles';
import CustomHeader from '../components/CustomHeader';

// IMPORTANTE: service de cadastro
import { cadastrarUsuario } from "../services/usuarioService";

export default function CadastroScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isSenhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animação de opacidade
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
  });

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        contentOpacity.setValue(0);
        footerOpacity.setValue(0);
      };
    }, [])
  );

  // Botão animado
  const scaleValue = useRef(new Animated.Value(1)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: isHovered ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isHovered]);

  const onPressIn = () => {};
  const onPressOut = () => {};

  const animatedBackgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#17ABF8', '#118ACB'],
  });

  const animatedButtonStyle = {
    transform: [{ scale: scaleValue }],
    backgroundColor: animatedBackgroundColor,
  };

  const navigateWithFadeOut = (path) => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(path);
    });
  };

  // 🔥 ATUALIZADO: Agora chama o backend REAL
  const handleCadastro = async () => {
    setErro('');

    if (!nomeUsuario || !email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro('Formato de email inválido.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      await cadastrarUsuario(nomeUsuario, email, senha);

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigateWithFadeOut("/login");

    } catch (error) {
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <CustomHeader
        showMenu={true}
        menuPosition='left'
        closeButtonSide='right'
        headerStyle='solid'
        showBackButton={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          <View style={styles.backgroundEllipse} />

          <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
            <Text style={styles.title}>Cadastro</Text>

            <TextInput
              placeholder="Nome de Usuário"
              style={styles.input}
              placeholderTextColor="#919191"
              value={nomeUsuario}
              onChangeText={setNomeUsuario}
              autoCapitalize="none"
              returnKeyType="next"
            />

            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#919191"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Senha"
                style={styles.inputSenha}
                secureTextEntry={!isSenhaVisivel}
                placeholderTextColor="#919191"
                value={senha}
                onChangeText={setSenha}
                returnKeyType="go"
                onSubmitEditing={handleCadastro}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!isSenhaVisivel)} style={styles.eyeIcon}>
                <Feather name={isSenhaVisivel ? 'eye-off' : 'eye'} size={24} color="#919191" />
              </TouchableOpacity>
            </View>

            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

            <Animated.View style={[styles.mainButton, animatedButtonStyle]}>
              <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handleCadastro}
                disabled={isLoading}
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.mainButtonText}>CADASTRAR-SE</Text>
                )}
              </Pressable>
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
            <Text style={styles.footerText}>Já está cadastrado?</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigateWithFadeOut('/login')}
            >
              <Text style={styles.secondaryButtonText}>FAZER LOGIN</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
