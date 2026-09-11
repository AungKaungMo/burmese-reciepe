import Svg, { Path, type SvgProps } from "react-native-svg";

const Balanced = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M32 12v38M20 18h24M23 18l-9 16h18L23 18ZM41 18l-9 16h18L41 18Z"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 34c1.5 5 5 8 9 8s7.5-3 9-8M32 34c1.5 5 5 8 9 8s7.5-3 9-8M24 50h16"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Balanced;
