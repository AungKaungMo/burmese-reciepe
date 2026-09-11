import Svg, { Circle, Path, type SvgProps } from "react-native-svg";

const Pescatarian = ({
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
        d="M18 32c7-9 16-13 26-11l8-6v12l-8-6c-1 11-8 19-18 22-4-3-7-7-8-11Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Circle cx="33" cy="28" r="2.5" fill={color} />
      <Path
        d="M18 32c-4-4-7-5-10-4 2 4 5 7 10 8"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Pescatarian;
