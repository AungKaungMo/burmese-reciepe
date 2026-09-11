import Svg, { Path, type SvgProps } from "react-native-svg";

const Vegan = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M32 49c-12-6-18-15-17-27 9 1 16 5 20 12 2 4 2 9-3 15Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M32 49c12-6 18-15 17-27-9 1-16 5-20 12-2 4-2 9 3 15Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M32 49V19"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Vegan;
