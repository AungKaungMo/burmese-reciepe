import Svg, { Path, type SvgProps } from "react-native-svg";

const Lunch = ({ width = 64, height = 64, color = "#F5A623", ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" {...props}>
    <Path
      d="M15 37h34M19 37c1-11 6-17 13-17s12 6 13 17M32 20v-6M11 45h42"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Lunch;
