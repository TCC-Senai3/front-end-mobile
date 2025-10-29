// styles/CadastroStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

// Definição de Cores (pode ajustar se necessário)
const Cores = {
  fundo: '#FFFFFF',
  headerBg: '#00A9FF',         // Cor do header
  elipseBg: '#17ABF8',         // Cor sólida para a elipse
  botaoPrincipalBg: '#17ABF8', // Cor base do botão CADASTRAR
  botaoPressionadoBg: '#118ACB', // Cor do botão ao pressionar/hover
  textoTitulo: '#3B3939',
  textoInput: '#3B3939',
  placeholder: '#919191',
  textoBranco: '#FFFFFF',
  botaoSecundarioBorda: '#FFFFFF',
  botaoSecundarioTexto: '#FFFFFF',
  erro: '#D32F2F',             // Mantido para mensagens de erro
  link: '#007BFF',             // Mantido para links (se precisar)
};

export default StyleSheet.create({
  container: { // Estilo para SafeAreaView
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  backgroundEllipse: { // Elipse no fundo com cor sólida
    position: 'absolute',
    width: width * 1.8,
    height: width * 1.8,
    left: width * -0.4,
    top: height * 0.7,
    borderRadius: (width * 1.8) / 2,
    backgroundColor: Cores.elipseBg,
  },
  header: { // Estilo do Header azul (igual ao LoginStyles)
    backgroundColor: Cores.headerBg,
    height: height * 0.08,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: width * 0.05,
    zIndex: 1,
  },
  scrollContainer: { // Para o ScrollView (igual ao LoginStyles)
      flexGrow: 1,
      justifyContent: 'space-between',
  },
  content: { // Conteúdo central (igual ao LoginStyles, talvez ajuste paddingTop/Bottom se precisar mais espaço)
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.07,
    paddingTop: height * 0.15, // Um pouco menos que o login para dar espaço aos inputs extras
    paddingBottom: height * 0.05,
    zIndex: 1,
  },
  title: { // Igual ao LoginStyles
    fontFamily: 'Poppins-Bold', // Use o nome correto da fonte carregada
    fontSize: height * 0.04,
    color: Cores.textoTitulo,
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  input: { // Igual ao LoginStyles
    width: '100%',
    height: height * 0.06,
    backgroundColor: '#F0F0F0',
    borderRadius: 35,
    paddingHorizontal: 20,
    marginBottom: height * 0.02,
    fontFamily: 'Poppins-Regular', // Use o nome correto da fonte carregada
    fontSize: height * 0.02,
    color: Cores.textoInput,
  },
  // Adiciona container para o ícone de olho se precisar (opcional)
  inputContainer: {
     width: '100%',
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#F0F0F0',
     borderRadius: 35,
     marginBottom: height * 0.02,
     paddingHorizontal: 20, // Padding para texto
     height: height * 0.06,
   },
   inputSenha: { // Estilo específico para input de senha dentro do container
       flex: 1, // Ocupa espaço disponível
       fontFamily: 'Poppins-Regular',
       fontSize: height * 0.02,
       color: Cores.textoInput,
       height: '100%', // Garante altura total
   },
   eyeIcon: {
       paddingLeft: 10, // Espaço entre texto e ícone
   },
  mainButton: { // Botão principal (CADASTRAR) - Igual ao LoginStyles
    width: width * 0.5,
    height: height * 0.06,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    overflow: 'hidden',
  },
  mainButtonText: { // Igual ao LoginStyles
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.02,
    color: Cores.textoBranco,
    textTransform: 'uppercase',
  },
  footer: { // Rodapé (igual ao LoginStyles)
    width: '100%',
    height: height * 0.20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    zIndex: 1,
  },
  footerText: { // Igual ao LoginStyles
    fontFamily: 'Poppins-Regular',
    fontSize: height * 0.03,
    color: Cores.textoBranco,
    marginBottom: height * 0.01,
  },
  secondaryButton: { // Botão secundário (FAZER LOGIN) - Igual ao LoginStyles
    width: width * 0.5,
    height: height * 0.05,
    borderColor: Cores.botaoSecundarioBorda,
    borderWidth: 1.45,
    borderRadius: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: { // Igual ao LoginStyles
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.018,
    color: Cores.botaoSecundarioTexto,
    textTransform: 'uppercase',
  },
  errorText: { // Estilo de erro (igual ao LoginStyles)
      color: Cores.erro,
      fontSize: width * 0.035,
      marginTop: -height * 0.01,
      marginBottom: height * 0.015,
      textAlign: 'center',
      width: '100%',
      // fontFamily: 'Poppins-Regular',
  },
});