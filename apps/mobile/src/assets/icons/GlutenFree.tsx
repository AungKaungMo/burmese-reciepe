import Svg, { Path, type SvgProps } from "react-native-svg";

const GlutenFree = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M32 12v40M32 20c-8-1-13-5-15-10M32 29c-8-1-13-5-15-10M32 38c-8-1-13-5-15-10M32 20c8-1 13-5 15-10M32 29c8-1 13-5 15-10M32 38c8-1 13-5 15-10"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Path
        d="M14 50 50 14"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default GlutenFree;
