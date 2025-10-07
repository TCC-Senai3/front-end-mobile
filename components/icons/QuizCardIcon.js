import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill="#D9D9D9"
      d="M.656 6.438a6.309 6.309 0 0 1 6.31-6.31H52.93a6.31 6.31 0 0 1 6.309 6.31v48.836a6.309 6.309 0 0 1-6.31 6.309H6.966a6.309 6.309 0 0 1-6.309-6.31V6.438Z"
    />
  </Svg>
)
export default SvgComponent
