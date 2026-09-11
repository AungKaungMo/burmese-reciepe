import Svg, { Circle, Path, type SvgProps } from "react-native-svg";

const Clock = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Circle cx="32" cy="34" r="20" stroke={color} strokeWidth={4} />
      <Path
        d="M32 22v13l9 5M25 8h14"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Clock;
