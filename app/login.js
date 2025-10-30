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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
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

  // Carregamento de fontes (movido para _layout.js seria o ideal)
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
      useNativeDriver: false,
    }).start();
  }, [isHovered]);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: false,
    }).start();
    setIsHovered(true);
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: false,
    }).start();
    setIsHovered(false);
  };

  const animatedBackgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#17ABF8', '#118ACB'],
  });

  const animatedButtonStyle = {
    transform: [{ scale: scaleValue }],
    backgroundColor: animatedBackgroundColor,
  };

  // --- Lógica de Login ---
  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, preencha todos seus campos');
      return;
    }

    // (Lógica igual à da tela de cadastro)
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setErro('');
    setIsLoading(true);

    try {
      // Sua lógica de autenticação aqui (API, fetch, etc)
      // Exemplo fictício:
      // const response = await api.login({ email, senha });
      // if (!response.success) setErro('Login ou senha incorretos');
      // else prossiga com o login...
      
      // Navegação para a tela de jogo após login bem-sucedido
      router.push('/jogo');
    } catch (error) {
      setErro('Erro ao tentar realizar login. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <CustomHeader
        showMenu={true}
        menuPosition="left"
        closeButtonSide="right"
        headerStyle="solid"
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.backgroundEllipse} />
          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>
            <TextInput
              placeholder="Nome de Usuário ou Email"
              style={styles.input}
              placeholderTextColor="#919191"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErro('');
              }}
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
                onChangeText={text => {
                  setSenha(text);
                  setErro('');
                }}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!isSenhaVisivel)} style={styles.eyeIcon}>
                <Feather name={isSenhaVisivel ? 'eye-off' : 'eye'} size={24} color="#919191" />
              </TouchableOpacity>
            </View>
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
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.mainButtonText}>LOGIN</Text>
                )}
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
