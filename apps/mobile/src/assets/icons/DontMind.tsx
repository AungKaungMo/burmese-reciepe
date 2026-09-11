import Svg, { Path, type SvgProps } from "react-native-svg";

const DontMind = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M22 10h20M22 54h20M24 10c0 10 3 14 8 18-5 4-8 8-8 18M40 10c0 10-3 14-8 18 5 4 8 8 8 18"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26 44h12"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default DontMind;
