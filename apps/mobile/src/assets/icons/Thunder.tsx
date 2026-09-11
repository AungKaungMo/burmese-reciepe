import Svg, { Path, type SvgProps } from "react-native-svg";

const Thunder = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" {...props}>
      <Path d="M36 6 14 35h16l-3 23 23-32H34l2-20Z" fill={color} />
    </Svg>
  );
};

export default Thunder;
