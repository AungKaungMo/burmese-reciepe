import Svg, { Path, type SvgProps } from "react-native-svg";

const Vegetarian = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M50 13C32 14 19 22 16 39c9 4 20 1 27-7 6-7 7-14 7-19Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M14 51c8-15 18-24 31-31"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Vegetarian;
