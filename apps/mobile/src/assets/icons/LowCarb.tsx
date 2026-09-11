import Svg, { Path, type SvgProps } from "react-native-svg";

const LowCarb = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M31 13c8 7 12 15 12 24 0 8-5 14-12 14s-12-6-12-14c0-9 4-17 12-24Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M16 50 48 18"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default LowCarb;
