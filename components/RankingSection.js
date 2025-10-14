// components/RankingSection.js

import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Image } from 'react-native';
import styles from '../styles/JogoStyles';
import { Trofeu1Icon, Trofeu2Icon, Trofeu3Icon, PerfilIcon, MedalhamenuIcon, RankingBannerIcon, BuscaIcon } from './icons/icon';


const rankingData = [
  { id: '1', rank: 1, name: 'Messi', score: 500 },
  { id: '2', rank: 2, name: 'Pelé', score: 450 },
  { id: '3', rank: 3, name: 'Cristiano', score: 400 },
  { id: '4', rank: 4, name: 'Ceni', score: 350 },
  { id: '5', rank: 5, name: 'Neuer', score: 300 }, 
  { id: '6', rank: 6, name: 'Buffon', score: 280 }, 
  { id: '7', rank: 7, name: 'Kante', score: 250 },
  { id: '8', rank: 8, name: 'Casemiro', score: 240 }, 
  { id: '9', rank: 9, name: 'Modric', score: 230 }, 
  { id: '10', rank: 10, name: 'Zidane', score: 220 },
];

export default function RankingSection() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(rankingData);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const newData = rankingData.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(rankingData);
    }
  };

  const renderUserCard = (item) => {
    const getRankComponent = () => {
      if (item.rank === 1) return <Trofeu1Icon style={styles.rankImage} />;
      if (item.rank === 2) return <Trofeu2Icon style={styles.rankImage} />;
      if (item.rank === 3) return <Trofeu3Icon style={styles.rankImage} />;
      return <Text style={styles.rankNumber}>{item.rank}</Text>;
    };

    return (
      <View key={item.id} style={styles.userCard}>
        <View style={styles.rankContainer}>{getRankComponent()}</View>
        <PerfilIcon style={styles.avatar} />
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.scoreContainer}>
            <MedalhamenuIcon style={styles.scoreIcon} />
            <Text style={styles.scoreText}>{item.score}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.rankingFrame}>
      <RankingBannerIcon style={styles.bannerImage} />
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Pesquisar jogador..." 
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearch}
        />
        <BuscaIcon style={styles.searchIcon} />
      </View>
      
      <View style={styles.listContainer}>
        {/* ATUALIZAÇÃO: Verifica se a lista de resultados está vazia */}
        {filteredData.length > 0 ? (
          <ScrollView style={styles.scrollableListContainer} nestedScrollEnabled={true}>
            {filteredData.map(item => renderUserCard(item))}
          </ScrollView>
        ) : (
          <View style={styles.searchEmptyContainer}>
            <Text style={styles.searchEmptyText}>Busca não encontrada</Text>
          </View>
        )}
      </View>
    </View>
  );
}