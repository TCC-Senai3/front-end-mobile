import React, { useRef, useState, useEffect, useCallback } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/LoginStyles";
import CustomHeader from "../components/CustomHeader";

// IMPORTAÇÃO DO SERVICE
import { loginUsuario } from "../services/usuarioService";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSenhaVisivel, setSenhaVisivel] = useState(false);

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  // Fontes
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
  });

  // Fade-in da tela
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

  // Animação do botão
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
    outputRange: ["#17ABF8", "#118ACB"],
  });

  const animatedButtonStyle = {
    transform: [{ scale: scaleValue }],
    backgroundColor: animatedBackgroundColor,
  };

  // Navegação suave
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
    ]).start(() => router.push(path));
  };

  // *************** LOGIN REAL ***************
  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      setErro("Por favor, preencha todos seus campos");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setErro("");
    setIsLoading(true);

    try {
      const resposta = await loginUsuario(email, senha);

      // Se quiser, salve token:
      // await AsyncStorage.setItem("token", resposta.token);

      navigateWithFadeOut("/jogo");
    } catch (error) {
      setErro(error.message || "Erro ao tentar realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <CustomHeader
        showMenu={true}
        menuPosition="left"
        closeButtonSide="right"
        headerStyle="solid"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.backgroundEllipse} />

          {/* Conteúdo principal */}
          <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
            <Text style={styles.title}>Login</Text>

            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#919191"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErro("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Senha"
                style={styles.inputSenha}
                secureTextEntry={!isSenhaVisivel}
                placeholderTextColor="#919191"
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  setErro("");
                }}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                onPress={() => setSenhaVisivel(!isSenhaVisivel)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={isSenhaVisivel ? "eye-off" : "eye"}
                  size={24}
                  color="#919191"
                />
              </TouchableOpacity>
            </View>

            <Link href="/Redefinicao-Senha" asChild>
              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>
            </Link>

            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

            <Animated.View style={[styles.mainButton, animatedButtonStyle]}>
              <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handleLogin}
                disabled={isLoading}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.mainButtonText}>LOGIN</Text>
                )}
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* Rodapé */}
          <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
            <Text style={styles.footerText}>Não está cadastrado?</Text>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigateWithFadeOut("/cadastro")}
            >
              <Text style={styles.secondaryButtonText}>CADASTRAR-SE</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
