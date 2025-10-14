import * as React from 'react'
import Svg, { Circle, Line } from 'react-native-svg'

const CancelIcon = ({ width = 200, height = 200, style, ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 200 200" style={style} {...props}>
    <Circle cx={100} cy={100} r={90} fill="#FF3B30" />
    <Line x1={60} y1={60} x2={140} y2={140} stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round" />
    <Line x1={140} y1={60} x2={60} y2={140} stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round" />
  </Svg>
)

export default CancelIcon
