import Svg, { Path, type SvgProps } from "react-native-svg";

const GainWeight = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Path
        d="M13 25v14M19 20v24M45 20v24M51 25v14M19 32h26"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default GainWeight;
