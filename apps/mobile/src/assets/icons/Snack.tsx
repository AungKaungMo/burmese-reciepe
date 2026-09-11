import Svg, { Path, type SvgProps } from "react-native-svg";

const Snack = ({ width = 64, height = 64, color = "#B94A35", ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" {...props}>
    <Path
      d="M17 21h29l-3 31H20l-3-31Z"
      stroke={color}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <Path
      d="M21 21c1-7 5-11 11-11s10 4 11 11M47 29h5c5 0 7 4 6 8-1 5-5 8-11 8M25 30h13"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </Svg>
);

export default Snack;
