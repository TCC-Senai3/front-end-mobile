import React from 'react';
import * as S from './styles';

const HomeScreen = () => {
  return (
    <S.ScreenContainer>
      <S.TopBar>
        <S.FlexGrow />
        <S.MenuIcon />
      </S.TopBar>

      <S.VerifiedIcon />

      <S.CorrectText>
        Correto!
      </S.CorrectText>

      <S.HomeIndicator />
    </S.ScreenContainer>
  );
};

export default HomeScreen;


