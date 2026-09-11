import Svg, { Path, type SvgProps } from "react-native-svg";

const HighProtein = ({
  width = 64,
  height = 64,
  color,
  ...props
}: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M21 51V37c0-4 3-7 7-7h4l3-9c1-4 5-7 9-7h3v11h-6l-3 10 7 7-6 9H21Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M21 38h-7v13h7M28 30l-5-8"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default HighProtein;
