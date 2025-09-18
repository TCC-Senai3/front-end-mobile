import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Sala() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1CB0FC" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.code}>CODE: 804723</Text>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Card de Ações */}
      <View style={styles.actionCard}>
        <TouchableOpacity style={styles.desmancharBtn}>
          <Text style={styles.desmancharText}>DESMANCHAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iniciarBtn}>
          <Text style={styles.iniciarText}>INICIAR</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Usuários */}
      <View style={styles.playersGrid}>
        {[0,1,2,3,4,5].map((i) => (
          <View style={styles.playerCard} key={i}>
            <Image source={require('../assets/images/user-profile 1.png')} style={styles.avatar} />
            <Text style={styles.playerName}>Usuário</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  code: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Blinker-Bold',
    textAlign: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 30,
    height: 30,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
    marginVertical: 2,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginTop: 24,
    padding: 20,
    justifyContent: 'space-between',
    width: 330,
    alignSelf: 'center',
    // Sombra destacada
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  desmancharBtn: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 130,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    elevation: 5,
  },
  desmancharText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Blinker-Bold',
  },
  iniciarBtn: {
    backgroundColor: '#FF9D00',
    borderRadius: 10,
    width: 130,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 5,
  },
  iniciarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 25,
    letterSpacing: 1,
    fontFamily: 'Blinker-Bold',
    textShadowColor: '#FF9D00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 330,
    marginTop: 40,
  },
  playerCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: 140,
    height: 100,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  playerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#3B3939',
  },
});
