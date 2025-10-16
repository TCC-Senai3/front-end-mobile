// styles/SemConexaoStyles.js

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Cores = {
    fundo: '#F4F4F4', // Um cinzento bem clarinho, como na imagem
    preto: '#000000',
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Cores.fundo,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center',     // Centraliza horizontalmente
        paddingHorizontal: width * 0.05,
    },
    iconContainer: {
        marginBottom: height * 0.05, // Espaço entre o ícone e o texto
    },
    messageText: {
        fontSize: width * 0.07, // Tamanho do texto proporcional à largura da tela
        fontFamily: 'Poppins-Regular', 
        color: Cores.preto,
        textAlign: 'center',
    },
});