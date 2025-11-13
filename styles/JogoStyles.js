import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Paleta de cores unificada para a tela
const Cores = {
    header: '#FFFFFF',
    fundo: '#FFFFFF',
    branco: '#FFFFFF',
    azul: '#00A9FF',
    azulBotao: '#00B7FF',
    cardFundo: '#A3BFDD',
    cardTexto: '#4A4A4A',
    cardRanqueadoFundo: '#E5CFB7',
    buttonRanqueado: '#FFCC00',
    cardPrivadaFundo: '#A4DCAB',
    buttonPrivada: '#00E339',
    cardPrivadaTexto: '#2E4031',
    fundoRanking: '#D8E6FB',
    fundoQuestionario: '#D8E6FB', // Cor unificada para o fundo do questionário
    tabInativa: '#E8E8E8',
    tabTextoInativo: '#757575',
};

const styles = StyleSheet.create({
    // ==========================================
    // --- Estilos Gerais da Tela ---
    // ==========================================
    safeArea: {
        flex: 1,
        backgroundColor: Cores.fundo
    },
    scrollViewContent: {
        flexGrow: 1,
        backgroundColor: Cores.fundo,
    },

    // ==========================================
    // --- Estilos da Seção de Jogo ---
    // ==========================================
    waveContainer: {
        height: height * 0.50,
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    waveImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: '20%',
    },
    appTitleContainer: {
        alignItems: 'center',
        marginTop: -height * 0.20,
        zIndex: 1
    },
    appTitleSenai: {
        color: Cores.branco,
        fontFamily: 'Blinker-ExtraBold',
        fontSize: width * 0.15,
    },
    appTitleSkillUp: {
        color: Cores.branco,
        fontFamily: 'Blinker-Regular',
        fontSize: width * 0.15,
        marginTop: -height * 0.025
    },
    carouselArea: {
        backgroundColor: Cores.fundo,
        marginTop: -height * 0.08,
        position: 'relative',
        height: height * 0.5,
        justifyContent: 'center'
    },
    carouselContainer: {
        alignItems: 'center'
    },
    card: {
        backgroundColor: Cores.cardFundo,
        width: width * 0.75,
        height: height * 0.35,
        borderRadius: 20,
        marginHorizontal: (width - width * 0.75) / 2,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 60,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 30,
    },
    cardRanqueado: {
        backgroundColor: Cores.cardRanqueadoFundo
    },
    cardPrivada: {
        backgroundColor: Cores.cardPrivadaFundo
    },
    cardTextContent: {
        alignItems: 'center',
        marginTop: 5
    },
    cardTitle: {
        fontSize: width * 0.045,
        fontFamily: 'Poppins-Bold',
        color: Cores.cardTexto,
        textAlign: 'center'
    },
    cardPrivadaTitle: {
        color: Cores.cardPrivadaTexto
    },
    cardSubtitle: {
        fontSize: width * 0.030,
        color: Cores.cardTexto,
        textAlign: 'center',
        marginTop: 5,
        lineHeight: width * 0.035,
        fontFamily: 'Poppins-Medium'
    },
    cardPrivadaSubtitle: {
        color: Cores.cardPrivadaTexto
    },
    cardIconImage: {
        width: 62,
        height: 62,
        resizeMode: 'contain',
    },
    
    cardLivrosImage: {
        width: width * 0.20, 
        height: width * 0.20,
        resizeMode: 'contain',
    },
    cardButton: {
        backgroundColor: Cores.azulBotao,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.10,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 10
    },
    buttonRanqueado: {
        backgroundColor: Cores.buttonRanqueado
    },
    buttonPrivada: {
        backgroundColor: Cores.buttonPrivada
    },
    cardButtonText: {
        color: Cores.branco,
        fontSize: width * 0.07,
        fontFamily: 'Blinker-Bold',
        textAlign: 'center'
    },
    arrow: {
        position: 'absolute',
        top: '45%',
        zIndex: 2
    },
    arrowLeft: {
        left: 15
    },
    arrowRight: {
        right: 15
    },

    // ==========================================
    // --- Estilos para Abas e Frames ---
    // ==========================================
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Cores.fundo,
        paddingVertical: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        gap: 20,

    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        backgroundColor: Cores.tabInativa,
    },
    activeTabButton: {
        backgroundColor: Cores.azul,
    },
    tabText: {
        fontSize: width * 0.04,
        fontFamily: 'Poppins-bold',
        color: Cores.tabTextoInativo,
    },
    activeTabText: {
        color: Cores.branco,
    },
    frameContainer: {
        width: width,
        paddingBottom: 20,
    },

    // ==========================================
    // --- Estilos da Seção de Ranking ---
    // ==========================================
    rankingFrame: {
        marginHorizontal: width * 0.05,
        marginTop: 40,
        borderRadius: 20,
        backgroundColor: Cores.fundoRanking,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        height: height * 0.65, // <-- ALTURA FIXA RESTAURADA
    },
    bannerImage: {
        width: width * 0.7,
        height: 90,
        alignSelf: 'center',
        position: 'absolute',
        top: -43,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '5%',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: width * 0.04,
        fontFamily: 'Poppins-Regular',
        backgroundColor: Cores.branco,
        borderRadius: 50,
        paddingHorizontal: 20,
        elevation: 3,
        paddingRight: 50,
    },
    searchIcon: {
        width: width * 0.06,
        height: width * 0.06,
        position: 'absolute',
        right: 20,
    },
    listContainer: {
        paddingHorizontal: '5%',
        flex: 1,
    },
    scrollableListContainer: {
        flex: 1,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Cores.branco,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        elevation: 2
    },
    rankContainer: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rankImage: {
        width: width * 0.08,
        height: width * 0.08,
        resizeMode: 'contain'
    },
    rankNumber: {
        fontSize: width * 0.045,
        fontFamily: 'Poppins-Regular',
        color: '#888'
    },
    avatar: {
        width: width * 0.12,
        height: width * 0.12,
        borderRadius: width * 0.06,
        marginHorizontal: '2%'
    },
    userName: {
        flex: 1,
        fontSize: width * 0.040,
        fontFamily: 'Poppins-Regular'
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    scoreIcon: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: 5
    },
    scoreText: {
        fontSize: width * 0.04,
        fontFamily: 'Poppins-Regular'
    },
    searchEmptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    searchEmptyText: {
        fontSize: width * 0.045,
        color: '#667',
        textAlign: 'center',
    },

    // ==========================================
    // --- Estilos do Frame de Questionário ---
    // ==========================================
    questionarioFrame: {
        marginHorizontal: width * 0.05,
        marginTop: 40,
        borderRadius: 20,
        backgroundColor: Cores.fundoQuestionario,
        paddingTop: 45,
        paddingBottom: 20,
        paddingHorizontal: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        height: height * 0.65, // <-- ALTURA FIXA RESTAURADA
    },
    quizTitleBanner: {
        width: width * 0.7,
        height: 90,
        alignSelf: 'center',
        position: 'absolute',
        top: -43,
    },
    quizListContainer: {
        flex: 1,
        marginTop: 10,
    },
    quizCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        marginHeight: 85,
        backgroundColor: '#ffff',
    },
    quizCardTextContainer: {
        flex: 1,
    },
    quizCardTitle: {
        fontSize: width * 0.05,
        fontFamily: 'Poppins-bold',
        color: '#000'
    },
    quizCardDescription: {
        fontSize: width * 0.035,
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
        color: '#000'
    },
});

export default styles;