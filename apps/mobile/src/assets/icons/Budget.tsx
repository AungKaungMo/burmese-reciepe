import Svg, { Ellipse, Path, type SvgProps } from "react-native-svg";

const Budget = ({ width = 64, height = 64, color, ...props }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <Ellipse cx="32" cy="18" rx="17" ry="7" stroke={color} strokeWidth={4} />
      <Path
        d="M15 18v10c0 4 8 7 17 7s17-3 17-7V18M15 28v10c0 4 8 7 17 7s17-3 17-7V28M15 38v8c0 4 8 7 17 7s17-3 17-7v-8"
        stroke={color}
        strokeWidth={4}
      />
    </Svg>
  );
};

export default Budget;
