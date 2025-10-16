// styles/RecuperacaoEmailStyles.js

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
    // Estilo que centraliza todo o conteúdo da tela
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.07,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: height * 0.04, // Espaço abaixo do logo
    },
    // Estilos para o título da página
    titleContainer: {
        alignItems: 'center',
        marginBottom: height * 0.05, // Espaço abaixo do título
    },
    pageTitle: {
        fontSize: width * 0.05,
        fontFamily: 'Poppins-Bold', // Certifique-se que esta fonte está carregada
        color: Cores.preto,
    },
    // O 'content' agora serve apenas para agrupar o formulário
    content: {
        width: '100%',
    },
    // Container do campo de email (com a borda e fundo)
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
    // Estilo do texto dentro do campo de email
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 20,
        fontSize: width * 0.04,
        fontFamily: 'Poppins-Regular',
        color: Cores.preto,
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
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.05,
        height: height * 0.080,
        width: width * 0.40,
        alignSelf: 'center',
    },
    buttonText: {
        color: Cores.branco,
        fontSize: width * 0.050,
        fontFamily: 'Poppins-Bold',
    },
});