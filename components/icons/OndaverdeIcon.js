import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={57}
    height={57}
    fill="none"
    {...props}
  >
    {/* Onda verde estilizada */}
    <Path
      d="M8 34c5-7 9 7 16 0 5-5 9 6 16-1"
      stroke="#22C55E"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SvgComponent
