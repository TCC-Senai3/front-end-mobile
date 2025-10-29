import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const Cores = {
  fundo: '#FFFFFF',
  headerBg: '#00A9FF',
  elipseBg: '#17ABF8',
  botaoPrincipalBg: '#17ABF8',
  botaoPressionadoBg: '#118ACB',
  textoTitulo: '#3B3939',
  textoInput: '#000000',
  placeholder: '#919191',
  textoBranco: '#FFFFFF',
  botaoSecundarioBorda: '#FFFFFF',
  botaoSecundarioTexto: '#FFFFFF',
  erro: '#D32F2F',
  link: '#007BFF',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  backgroundEllipse: {
    position: 'absolute',
    width: width * 1.8,
    height: width * 1.8,
    left: width * -0.4,
    top: height * 0.7,
    borderRadius: (width * 1.8) / 2,
    backgroundColor: Cores.elipseBg,
  },
  header: {
    backgroundColor: Cores.headerBg,
    height: height * 0.08,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: width * 0.05,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.07,
    paddingTop: height * 0.2,
    paddingBottom: height * 0.05,
    zIndex: 1,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.04,
    color: Cores.textoTitulo,
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  input: {
    width: '100%',
    height: height * 0.06,
    backgroundColor: '#F0F0F0',
    borderRadius: 35,
    paddingHorizontal: 20,
    marginBottom: height * 0.02,
    fontFamily: 'Poppins-Regular',
    fontSize: height * 0.02,
    color: Cores.textoInput,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 35,
    marginBottom: height * 0.02,
    paddingHorizontal: 20,
    height: height * 0.06,
  },
  inputSenha: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: height * 0.02,
    color: Cores.textoInput,
    height: '100%',
  },
  eyeIcon: {
    paddingLeft: 10,
  },

  // ---> ESTILOS ADICIONADOS AQUI <---
  forgotPasswordButton: {
    width: '100%',
    alignItems: 'left', // Alinha o link à direita
    marginBottom: height * 0.015, // Espaço antes da mensagem de erro
    marginTop: -height * 0.01, // Puxa um pouco para cima, mais perto da senha
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Regular',
    fontSize: height * 0.018,
    color: Cores.textoInput,
  },
  // ---> FIM DOS ESTILOS ADICIONADOS <---

  mainButton: {
    width: width * 0.5,
    height: height * 0.06,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    overflow: 'hidden',
  },
  mainButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.02,
    color: Cores.textoBranco,
    textTransform: 'uppercase',
  },
  footer: {
    width: '100%',
    height: height * 0.20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    zIndex: 1,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: height * 0.03,
    color: Cores.textoBranco,
    marginBottom: height * 0.01,
  },
  secondaryButton: {
    width: width * 0.5,
    height: height * 0.05,
    borderColor: Cores.botaoSecundarioBorda,
    borderWidth: 1.45,
    borderRadius: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.018,
    color: Cores.botaoSecundarioTexto,
    textTransform: 'uppercase',
  },
  errorText: {
    color: Cores.erro,
    fontSize: width * 0.035,
    // marginTop: -height * 0.01, // Removido para dar espaço ao "esqueceu senha"
    marginBottom: height * 0.015,
    textAlign: 'center',
    width: '100%',
  },
});