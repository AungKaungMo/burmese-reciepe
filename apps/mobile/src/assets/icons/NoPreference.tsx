import Svg, { Path, type SvgProps } from "react-native-svg";

const NoPreference = ({
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
        d="M18 28h28l-3 20H21l-3-20Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M22 28c2-8 7-12 10-12s8 4 10 12M25 13c2 3 2 6 0 9M33 10c2 4 2 7 0 11M41 13c2 3 2 6 0 9"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default NoPreference;
