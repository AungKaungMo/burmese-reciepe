import Svg, { Circle, Path, type SvgProps } from "react-native-svg";

const Breakfast = ({ width = 64, height = 64, color = "#F5A623", ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" {...props}>
    <Circle cx="32" cy="34" r="11" fill={color} />
    <Path
      d="M32 8v8M32 52v4M6 34h8M50 34h8M13 15l6 6M45 21l6-6M13 53l6-6M45 47l6 6"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </Svg>
);

export default Breakfast;
