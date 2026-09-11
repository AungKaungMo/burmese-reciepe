import Svg, { Path, Rect, type SvgProps } from "react-native-svg";

const ChefHat = ({ width = 128, height = 128, color = "#C93A2B", ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 128 128" fill="none" {...props}>
    <Path
      d="M43 91V74C34.7 72.7 28 65.5 28 56.8C28 47 36 39 45.8 39C49.6 30.3 56.9 25 64 25C73.4 25 81.3 31.2 84.2 39.8C94.2 39.8 102 47.4 102 57C102 66.2 95.1 73.7 86 75V91H43Z"
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x={43} y={91} width={43} height={13} rx={2} stroke={color} strokeWidth={5} />
  </Svg>
);

export default ChefHat;
