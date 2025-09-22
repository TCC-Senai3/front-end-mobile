import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/TermosStyles';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function TermosScreen() {

  // --- IMPLEMENTAÇÃO DA FONTE ---
  const [fontsLoaded] = useFonts({
    'Inria_Sans-Bold': require('../assets/fonts/Inria_Sans/InriaSans-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
  });// Importando os estilos

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="" showMenu={true} />

      <View style={styles.container}>
        <View style={styles.newTitleContainer}>
          <View style={styles.blueBar} />
          <Text style={styles.pageTitle}>Termos de Uso do Senai Skill Up</Text>
        </View>

        {/* Card com Scroll */}
        <View style={styles.cardContainer}>
            <View style={styles.card}>
              <ScrollView 
                showsVerticalScrollIndicator={true} 
                persistentScrollbar={true}
              >
                <TermosContent />
              </ScrollView>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
}


// Componente com o texto para evitar repetição
const TermosContent = () => (
  <>
    <Text style={styles.title}>Bem-vindo(a) ao Senai Skill Up!
Estes termos de uso ("Termos") regem o acesso e a utilização da nossa plataforma web. Ao se cadastrar ou utilizar o Senai Skill Up, você concorda com estes termos na íntegra. Por favor, leia-os atentamente.</Text>
    <Text style={styles.title}>1. Privacidade e Proteção de Dados</Text>
    <Text style={styles.paragraph}>
As informações e dados pessoais fornecidos por você ao se cadastrar e utilizar a plataforma são armazenados em nosso banco de dados de forma segura. Comprometemo-nos a não divulgar, compartilhar, vender ou alugar seus dados pessoais a terceiros sem o seu consentimento, exceto nos casos em que for exigido por lei.    </Text>
    <Text style={styles.title}>2. Descrição da Plataforma</Text>
    <Text style={styles.paragraph}>
O Senai Skill Up é uma plataforma de aprendizado interativo que oferece questionários e materiais sobre diversas matérias, criados por usuários específicos. A plataforma inclui um sistema de pontuação (ranking) e um histórico de desempenho para cada usuário.    </Text>
    <Text style={styles.title}>3. Cadastro e Acesso</Text>
    <Text style={styles.paragraph}>
Para utilizar a plataforma, você deve se cadastrar fornecendo informações precisas e completas. Você é o único responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta.    </Text>
    <Text style={styles.title}>4. Conteúdo e Propriedade Intelectual</Text>
    <Text style={styles.paragraph}>
Todo o conteúdo disponível na plataforma, incluindo questionários, textos, gráficos, imagens e o código-fonte, é de propriedade dos envolvidos nesse projeto e é protegido por leis de direitos autorais. Você não pode copiar, reproduzir, distribuir, publicar ou de qualquer forma usar o conteúdo sem a devida autorização.    </Text>
    <Text style={styles.title}>5. Uso do Perfil e Interação</Text>
    <Text style={styles.paragraph}>Ao utilizar a plataforma, você concorda que:

Outros usuários da plataforma poderão visualizar seu perfil, visualizando seu nome de usuário, sua pontuação e seu histórico de desempenho nos questionários.
Conduta do Usuário: Você se compromete a usar a plataforma de forma ética e respeitosa, não publicando ou compartilhando conteúdo ofensivo, ilegal ou que viole os direitos de terceiros.
Uso Pessoal: A plataforma destina-se ao seu uso pessoal e educacional. É proibida a utilização para fins comerciais sem a nossa autorização expressa.
    </Text>
    <Text style={styles.title}>6.  Sistema de Pontuação (Ranking)</Text>
    <Text style={styles.paragraph}>
O Senai Skill Up utiliza um sistema de pontuação para classificar o desempenho dos usuários. As pontuações são baseadas na sua participação e no acerto dos questionários. O ranking é uma ferramenta de gamificação para incentivar o aprendizado e não deve ser interpretado como uma avaliação formal.
    </Text>
    <Text style={styles.title}>7. Limitação de Responsabilidade</Text>
    <Text style={styles.paragraph}>
O Senai Skill Up é fornecido "como está". Não garantimos que a plataforma estará livre de erros ou interrupções, nem que todo o conteúdo será sempre preciso ou completo. Não nos responsabilizamos por perdas ou danos decorrentes do uso da plataforma.    </Text>
    <Text style={styles.title}>8. Encerramento da Conta</Text>
    <Text style={styles.paragraph}>
Podemos, a nosso critério, suspender ou encerrar sua conta se você violar qualquer uma das disposições destes termos.    </Text>
  </>
);
