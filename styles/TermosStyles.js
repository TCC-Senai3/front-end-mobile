import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Cores = {
  primaria: '#00ABFF', 
  blueBar: '#1CB0FC',
  fundo: '#FFFFFF',
  textoPrincipal: '#000000', 
  texto: '#626361',
  branco: '#FFFFFF',
  pageTitle: '#000000',
  headerAzul: '#00A9FF'
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Cores.headerAzul,
  },
  container: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  newTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    marginBottom: height * 0.01,
    
  },
  blueBar: {
    width: width * 0.02,
    height: height * 0.04,
    backgroundColor: Cores.blueBar,
    marginRight: width * 0.02,
    borderRadius: 71.87 
  },
  pageTitle: {
    fontSize: width * 0.05, 
    fontFamily: 'Inria_Sans-Bold', 
    color: Cores.pageTitle,
  },
  cardContainer: {
    flex: 1,
    padding: width * 0.05,
  },
  card: {
    flex: 1, // Card agora ocupa o espaço do contentor
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingHorizontal: width * 0.06,
    paddingVertical: width * 0.02, // Espaçamento vertical menor para começar do topo
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'Poppins-Medium',
    color: Cores.textoPrincipal,
    marginTop: height * 0.02,
    marginBottom: height * 0.005,
  },
  paragraph: {
    fontSize: width * 0.04,
    color: Cores.texto,
    lineHeight: height * 0.03,
    marginBottom: height * 0.015,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left'
  },
  
});

export default styles;

