// app/cadastro.js

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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { useFonts } from 'expo-font';
import styles from '../styles/CadastroStyles'; // Usa os estilos de Cadastro
import CustomHeader from '../components/CustomHeader'; // Import já existente

// import api from '../config/api';

export default function CadastroScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isSenhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
   const [fontsLoaded] = useFonts({
        'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    
    
      });

  // --- Lógica de Animação para o Botão (inalterada) ---
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

   const onPressIn = () => { /* ... */ };
   const onPressOut = () => { /* ... */ };
   const inputRange = [0, 1];
   const outputRange = ['#17ABF8', '#118ACB'];
   const animatedBackgroundColor = colorAnimation.interpolate({ inputRange, outputRange });
   const animatedButtonStyle = {
     transform: [{ scale: scaleValue }],
     backgroundColor: animatedBackgroundColor,
   };
  // --- Fim da Animação ---

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
      // --- LÓGICA DE CADASTRO (simulação) ---
      console.log('Tentando cadastrar com:', nomeUsuario, email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Simulação: Cadastro bem-sucedido');
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça o login.');
      router.push('/login');
      setIsLoading(false);
      // --- FIM CADASTRO ---
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

        {/* <<< ALTERADO AQUI PARA MOSTRAR O MENU >>> */}
        <CustomHeader
            showMenu={true}         // <<< MOSTRAR o botão de menu
            menuPosition='left'    // <<< Posição do ícone (igual ao login)
            closeButtonSide='right' // <<< Posição do 'X' (igual ao login)
            headerStyle='solid'     // <<< Usa o fundo azul
            showBackButton={false}  // <<< GARANTIR que o botão voltar NÃO aparece
        />

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* Elipse no Fundo */}
                <View style={styles.backgroundEllipse} />

                {/* Conteúdo Central */}
                <View style={styles.content}>
                    <Text style={styles.title}>Cadastro</Text>

                    {/* Campo Nome de Usuário */}
                    <TextInput
                        placeholder="Nome de Usuário"
                        style={styles.input}
                        placeholderTextColor="#919191"
                        value={nomeUsuario}
                        onChangeText={setNomeUsuario}
                        autoCapitalize="none"
                        returnKeyType="next"
                    />

                    {/* Campo Email */}
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

                    {/* Campo Senha */}
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

                    {/* Botão Principal Animado */}
                    <Animated.View style={[styles.mainButton, animatedButtonStyle]}>
                        <Pressable
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            onPress={handleCadastro}
                            disabled={isLoading}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                        >
                        {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.mainButtonText}>CADASTRAR-SE</Text>}
                        </Pressable>
                    </Animated.View>
                </View>

                {/* Rodapé */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Já está cadastrado?</Text>
                    <Link href="/login" asChild>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>FAZER LOGIN</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}