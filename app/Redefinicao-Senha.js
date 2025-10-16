// app/Redefinicao-Senha.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import styles from '../styles/RedefinicaoSenhaStyles';
import CustomHeader from '../components/CustomHeader';
import SenhaIcon from '../components/icons/Senha'; // Nome do componente com letra maiúscula
import { useFonts } from 'expo-font';


export default function RedefinicaoSenhaScreen() {
    const router = useRouter();
    const [novaSenha, setNovaSenha] = useState('');
    const [isSenhaVisivel, setSenhaVisivel] = useState(false);
    const [erro, setErro] = useState('');

    const [fontsLoaded] = useFonts({
        'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),    
    
      });

    const handleRedefinirSenha = () => {
        setErro('');
        if (!novaSenha) {
            setErro('Por favor, preencha o campo de senha.');
            return;
        }
        if (novaSenha.length < 6) {
            setErro('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        
        Alert.alert('Sucesso!', 'Sua senha foi redefinida com sucesso.');
        router.replace('/login'); 
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.container}>
                <CustomHeader showMenu={true} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        
                        <View style={styles.logoContainer}>
                            <SenhaIcon />
                        </View>
                        
                        <View style={styles.content}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nova Senha"
                                    placeholderTextColor="#888"
                                    secureTextEntry={!isSenhaVisivel}
                                    value={novaSenha}
                                    onChangeText={setNovaSenha}
                                />
                                <TouchableOpacity onPress={() => setSenhaVisivel(!isSenhaVisivel)} style={styles.eyeIcon}>
                                    <Feather name={isSenhaVisivel ? 'eye-off' : 'eye'} size={24} color="#888" />
                                </TouchableOpacity>
                            </View>

                            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

                            <TouchableOpacity style={styles.button} onPress={handleRedefinirSenha}>
                                <Text style={styles.buttonText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}