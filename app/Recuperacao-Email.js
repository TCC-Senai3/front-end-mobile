// app/recuperacao-email.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import styles from '../styles/RecuperacaoEmailStyles';
import CustomHeader from '../components/CustomHeader';
import EmailIcon from '../components/icons/Email'; // Corrigido para o ícone de Email

// Função para validar email
const isEmailValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export default function RecuperacaoEmailScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');

    const handleRecuperarEmail = () => {
        setErro('');
        if (!email.trim()) {
            setErro('Por favor, preencha o campo de email.');
            return;
        }
        if (!isEmailValido(email)) {
            setErro('Por favor, insira um email válido.');
            return;
        }
        
        Alert.alert('Verifique seu Email', 'Se o email estiver correto, você receberá um link para redefinir sua senha.');
        router.push('/login');
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
                            <EmailIcon />
                        </View>
                        

                        <View style={styles.content}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Insira seu Email"
                                    placeholderTextColor="#888"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

                            <TouchableOpacity style={styles.button} onPress={handleRecuperarEmail}>
                                <Text style={styles.buttonText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}