import React, { useRef, useState, useEffect } from 'react';
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
  SafeAreaView, // Importação do SafeAreaView
  ActivityIndicator
} from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import styles from '../styles/LoginStyles';
import CustomHeader from '../components/CustomHeader';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSenhaVisivel, setSenhaVisivel] = useState(false);

  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
  });

  // --- Lógica de Animação ---
  const scaleValue = useRef(new Animated.Value(1)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: isHovered ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // backgroundColor não suportado
    }).start();
  }, [isHovered]);

  const onPressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
    setIsHovered(true);
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
    setIsHovered(false);
  };

  const inputRange = [0, 1];
  const outputRange = ['#17ABF8', '#118ACB'];

  const animatedBackgroundColor = colorAnimation.interpolate({
    inputRange: inputRange,
    outputRange: outputRange
  });

  const animatedButtonStyle = {
    transform: [{ scale: scaleValue }],
    backgroundColor: animatedBackgroundColor,
  };

  // --- Lógica de Login ---
  const handleLogin = async () => {
    setErro('');
    if (!email || !senha) {
      setErro('Preencha usuário/email e senha.');
      return;
    }
    setIsLoading(true);

    const emailValido = /\S+@\S+\.\S+/;
    if (!emailValido.test(email)) {
      setErro('Por favor, insira um email válido.');
      setIsLoading(false);
      return;
    }

    // Simulação de login
    console.log('Tentando logar com:', email);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email.toLowerCase() === 'teste@teste.com' && senha === '123456') {
      router.replace('/jogo'); // Navega para a tela principal
    } else {
      setErro('Usuário/Email ou senha inválidos.');
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
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.backgroundEllipse} />

          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>
            <TextInput
              placeholder="Nome de Usuario ou Email"
              style={styles.input}
              placeholderTextColor="#919191"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            {/* Container para o campo de senha com ícone */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Senha"
                style={styles.inputSenha}
                secureTextEntry={!isSenhaVisivel}
                placeholderTextColor="#919191"
                value={senha}
                onChangeText={setSenha}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!isSenhaVisivel)} style={styles.eyeIcon}>
                <Feather name={isSenhaVisivel ? 'eye-off' : 'eye'} size={24} color="#919191" />
              </TouchableOpacity>
            </View>

            {/* ---> Link "Esqueceu sua senha?" ADICIONADO AQUI <--- */}
            <Link href="/esqueci-senha" asChild>
              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            </Link>

            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

            <Animated.View style={[styles.mainButton, animatedButtonStyle]}>
              <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handleLogin}
                disabled={isLoading}
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.mainButtonText}>LOGIN</Text>}
              </Pressable>
            </Animated.View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não está cadastrado?</Text>
            <Link href="/cadastro" asChild>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>CADASTRAR-SE</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}