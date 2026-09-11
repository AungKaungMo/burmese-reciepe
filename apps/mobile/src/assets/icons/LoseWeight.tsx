import Svg, { Path, type SvgProps } from "react-native-svg";

const LoseWeight = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M34 8c2 10-6 13-6 22 0 4 2 7 5 9-1-8 6-10 8-17 7 7 11 14 9 22-2 9-10 14-19 14S14 51 14 41c0-12 9-20 20-33Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LoseWeight;
