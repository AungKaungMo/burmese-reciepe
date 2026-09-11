import Svg, { Ellipse, G, Path, type SvgProps } from "react-native-svg";

const Normal = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
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
        <Ellipse cx="27" cy="20" rx="14" ry="5" />
        <Path d="M13 20v8c0 3 6 5 14 5s14-2 14-5v-8M13 28v8c0 3 6 5 14 5s14-2 14-5v-8M13 36v8c0 3 6 5 14 5s14-2 14-5v-8" />
        <Ellipse cx="45" cy="15" rx="10" ry="4" />
        <Path d="M35 15v7c0 2 4 4 10 4s10-2 10-4v-7" />
      </G>
    </Svg>
  );
};

export default Normal;
