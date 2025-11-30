import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import styles from '../styles/JogoStyles';

import Trofeu1Icon from '../components/icons/Trofeu1Icon';
import Trofeu2Icon from '../components/icons/Trofeu2Icon';
import Trofeu3Icon from '../components/icons/Trofeu3Icon';
import PerfilIcon from '../components/icons/PerfilIcon';
import MedalhamenuIcon from '../components/icons/MedalhamenuIcon';
import RankingBannerIcon from '../components/icons/RankingBannerIcon';
import BuscaIcon from '../components/icons/BuscaIcon';

import { getRankingGlobal } from '../services/rankingService';

// Ícones SVG locais
import BodeIcon from '../components/icons/BodeIcon';
import CanetabicIcon from '../components/icons/CanetabicIcon';
import PatoIcon from '../components/icons/PatoIcon';

export default function RankingSection() {
  const [searchText, setSearchText] = useState('');
  const [rankingData, setRankingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Mapeamento de nomes de avatar para componentes
  const avatarMap = {
    'bode': BodeIcon,
    'bode.svg': BodeIcon,
    'canetabic': CanetabicIcon,
    'canetabic.svg': CanetabicIcon,
    'pato': PatoIcon,
    'pato.svg': PatoIcon,
  };

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await getRankingGlobal();

        const enhancedData = data.map((item, index) => {
          const avatarKey = (item.avatar || '').toLowerCase();
          const AvatarComponent = avatarMap[avatarKey] || null;

          return {
            id: item.idUsuario,
            rank: index + 1,
            name: item.nomeUsuario,
            score: item.pontuacao,
            avatar: AvatarComponent, // componente SVG correto
          };
        });

        setRankingData(enhancedData);
        setFilteredData(enhancedData);
      } catch (error) {
        console.error('Erro ao carregar ranking:', error);
      }
    };

    loadRanking();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);

    if (!text.trim()) {
      setFilteredData(rankingData);
      return;
    }

    const newData = rankingData.filter(item =>
      item.name.toUpperCase().includes(text.toUpperCase()) ||
      item.rank.toString().includes(text) ||
      item.score.toString().includes(text)
    );

    setFilteredData(newData);
  };

  const renderUserCard = (item) => {
    const getRankComponent = () => {
      if (item.rank === 1) return <Trofeu1Icon style={styles.rankImage} />;
      if (item.rank === 2) return <Trofeu2Icon style={styles.rankImage} />;
      if (item.rank === 3) return <Trofeu3Icon style={styles.rankImage} />;
      return <Text style={styles.rankNumber}>{item.rank}</Text>;
    };

    const AvatarComponent = item.avatar || PerfilIcon;

    return (
      <View key={item.id} style={styles.userCard}>
        <View style={styles.rankContainer}>{getRankComponent()}</View>

        {/* Avatar */}
        <AvatarComponent style={styles.avatar} />

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
        {filteredData.length > 0 ? (
          <ScrollView style={styles.scrollableListContainer} nestedScrollEnabled>
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
