import Svg, { G, Path, type SvgProps } from "react-native-svg";

const Flexible = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <G
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M11 23 21 12h22l10 11-21 29L11 23Z" />
        <Path d="M11 23h42M21 12l6 11 5-11 5 11 6-11M27 23l5 29 5-29" />
      </G>
    </Svg>
  );
};

export default Flexible;
