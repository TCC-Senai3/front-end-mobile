import * as React from "react"
import Svg, { Path, Rect, Circle } from "react-native-svg"

const GameboyIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={320}
    height={320}
    viewBox="0 0 320 320"
    fill="none"
    {...props}
  >
    {/* Console principal */}
    <Rect
      x={40}
      y={60}
      width={240}
      height={180}
      rx={20}
      fill="#4A4A4A"
      stroke="#2A2A2A"
      strokeWidth={4}
    />
    
    {/* Tela */}
    <Rect
      x={60}
      y={80}
      width={200}
      height={120}
      rx={8}
      fill="#1A1A1A"
    />
    
    {/* Tela interna */}
    <Rect
      x={70}
      y={90}
      width={180}
      height={100}
      rx={4}
      fill="#2A2A2A"
    />
    
    {/* Controles direcionais */}
    <Circle
      cx={120}
      cy={220}
      r={25}
      fill="#2A2A2A"
      stroke="#1A1A1A"
      strokeWidth={2}
    />
    
    {/* Cruz direcional */}
    <Path
      d="M120 200 L120 240 M100 220 L140 220"
      stroke="#4A4A4A"
      strokeWidth={3}
      strokeLinecap="round"
    />
    
    {/* Botões A e B */}
    <Circle
      cx={200}
      cy={220}
      r={15}
      fill="#2A2A2A"
      stroke="#1A1A1A"
      strokeWidth={2}
    />
    <Circle
      cx={220}
      cy={200}
      r={15}
      fill="#2A2A2A"
      stroke="#1A1A1A"
      strokeWidth={2}
    />
    
    {/* Texto A e B */}
    <Path
      d="M200 215 L200 225 M195 220 L205 220"
      stroke="#4A4A4A"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M220 195 L220 205 M215 200 L225 200"
      stroke="#4A4A4A"
      strokeWidth={2}
      strokeLinecap="round"
    />
    
    {/* Detalhes da tela */}
    <Rect
      x={80}
      y={100}
      width={160}
      height={80}
      rx={2}
      fill="#0A0A0A"
    />
    
    {/* Brilho na tela */}
    <Rect
      x={85}
      y={105}
      width={150}
      height={70}
      rx={1}
      fill="#1A1A1A"
      opacity={0.3}
    />
  </Svg>
)

export default GameboyIcon
