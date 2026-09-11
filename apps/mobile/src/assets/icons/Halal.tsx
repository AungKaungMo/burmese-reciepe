import Svg, { Path, type SvgProps } from "react-native-svg";

const Halal = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M39 14c-9 3-15 11-15 20 0 9 6 17 15 20-15 1-27-8-27-20s12-21 27-20Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M45 18l2 5 5 .5-4 3.5 1.3 5-4.3-2.8-4.3 2.8 1.3-5-4-3.5 5-.5 2-5Z"
        fill={color}
      />
    </Svg>
  );
};

export default Halal;
