import Svg, { Path, type SvgProps } from "react-native-svg";

const Dinner = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" {...props}>
      <Path
        d="M43 11c-11 2-19 11-19 22 0 9 6 17 15 20-15 1-27-8-27-21 0-12 12-22 31-21Z"
        fill={color}
      />
      <Path
        d="m47 19 2 4 5 .7-3.5 3.4.8 4.9-4.3-2.3-4.3 2.3.8-4.9-3.5-3.4 5-.7 2-4Z"
        fill={color}
      />
    </Svg>
  );
};

export default Dinner;
