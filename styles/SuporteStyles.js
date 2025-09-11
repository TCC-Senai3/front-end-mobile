import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Definindo constantes de cores para reutilização
const Cores = {
  primaria: '#00ABFF',
  blueBar: '#1CB0FC',
  fundo: '#FFFFFF',
  textoPrincipal: '#626361',
  textoInput: '#ABABAB',
  bordaInput: '#CACACA',
  branco: '#FFFFFF',
  pageTitle: '#000000',
  textimput: '#ABABAB',
};

const SuporteStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  // --- Título da Página ---
  newTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, // 5% da largura da tela
    marginTop: height * 0.03, // 3% da altura da tela
    marginBottom: height * 0.02,
  },
  blueBar: {
    width: width * 0.02,
    height: height * 0.035,
    backgroundColor: Cores.blueBar,
    marginRight: width * 0.03,
    borderRadius: 10,
  },
  pageTitle: {
    fontSize: width * 0.055, // Fonte responsiva
    fontWeight: 'bold',
    color: Cores.pageTitle,
  },

  // --- Conteúdo do Formulário ---
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  label: {
    fontSize: width * 0.038, // Fonte responsiva
    color: Cores.textoPrincipal,
    marginBottom: height * 0.03,
    lineHeight: height * 0.025,
  },
  inputLabel: {
    fontSize: width * 0.04,
    color: '#000000',
    marginBottom: 5,
  },
  input: {
    backgroundColor: Cores.branco,
    width: '100%', // Ocupa 100% da largura do container pai
    minHeight: 45,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Cores.bordaInput,
    fontSize: width * 0.04,
    color: Cores.textoInput,
  },
  textArea: {
    backgroundColor: Cores.branco,
    width: '100%',
    minHeight: height * 0.15, // 15% da altura da tela
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Cores.bordaInput,
    textAlignVertical: 'top',
    fontSize: width * 0.04,
    color: Cores.textoInput,
  },
  button: {
    backgroundColor: Cores.primaria,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start', // Alinha o botão à esquerda
  },
  buttonText: {
    color: Cores.branco,
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SuporteStyles;