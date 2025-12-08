import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Modal,
} from "react-native";
import { Stack } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import styles from "../styles/ContatoStyles";

export default function ContatoScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);

  const enviar = () => {
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const subject = encodeURIComponent(`Contato de ${nome}`);
    const body = encodeURIComponent(
      `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
    );
    const to = "osdrakedosenai@gmail.com";

    const mailUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    Linking.openURL(mailUrl)
      .then(() => {
        setSuccessVisible(true);
        setNome("");
        setEmail("");
        setMensagem("");
      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o app de email.");
      });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <CustomHeader showMenu={true} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.content}>
<View style={styles.newTitleContainer}>
  <View style={styles.blueBar} />
  <Text style={styles.pageTitle}>Contato</Text>
</View>

            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#777"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu email"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Mensagem</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Digite sua mensagem"
              placeholderTextColor="#777"
              value={mensagem}
              onChangeText={setMensagem}
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={enviar}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Modal de sucesso */}
      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successCardText}>
              App de email aberto!
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
