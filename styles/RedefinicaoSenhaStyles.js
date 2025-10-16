// styles/RedefinicaoSenhaStyles.js

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Cores para esta tela
const Cores = {
    fundo: '#FFFFFF',
    preto: '#000000',
    branco: '#FFFFFF',
    azulBotao: '#00ABFF',
    bordaInput: '#000',
    fundoInput: '#F0F0F0',
    erro: '#D32F2F',
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Cores.fundo,
    },
    // Estilo para o container do ScrollView, que centraliza TUDO
    scrollContainer: {
        flexGrow: 1, // Essencial para o ScrollView crescer e ocupar espaço
        justifyContent: 'center', // Centraliza todo o conteúdo na vertical
        paddingHorizontal: width * 0.07, // Adiciona margens laterais
    },
    // Estilo para o container da imagem/logo
    logoContainer: {
        alignItems: 'center', // Centraliza a imagem na horizontal
        marginBottom: height * 0.07,
  
    
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Cores.fundoInput,
        borderRadius: 60,
        marginBottom: height * 0.025,
        borderWidth: 2,
        borderColor: Cores.bordaInput,
        height: height * 0.075,
        width: width * 0.80,
        alignSelf: 'center', 

    },
    input: {
        flex: 1,
        height: 55,
        paddingHorizontal: 20,
        fontSize: width * 0.04,
        fontFamily: 'Poppins-Regular', // Certifique-se que esta fonte está carregada
        color: Cores.preto,
    },
    eyeIcon: {
        padding: 15,
    },
    errorText: {
        color: Cores.erro,
        textAlign: 'center',
        marginBottom: height * 0.02,
        fontFamily: 'Poppins-Regular',
        fontSize: width * 0.035,
    },
    button: {
        backgroundColor: Cores.azulBotao,
        paddingVertical: 15,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center', // Adicionado para centralizar o texto verticalmente
        marginTop: height * 0.05,
        height: height * 0.080,
        width: width * 0.40,
        alignSelf: 'center', // <-- ALTERAÇÃO PRINCIPAL AQUI
        // marginLeft: 45, // <-- REMOVIDO DAQUI
    },
    buttonText: {
        color: Cores.branco,
        fontSize: width * 0.050, // Ajustei o tamanho da fonte para caber melhor
        fontFamily: 'Poppins-Bold', // Certifique-se que esta fonte está carregada
    },
});