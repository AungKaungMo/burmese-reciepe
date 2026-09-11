import Svg, { Path, Rect, type SvgProps } from "react-native-svg";

const Calendar = ({ width = 128, height = 128, color = "#C93A2B", ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 128 128" fill="none" {...props}>
    <Rect x={24} y={32} width={80} height={72} rx={10} stroke={color} strokeWidth={5} />
    <Path d="M24 50H104" stroke={color} strokeWidth={5} strokeLinecap="round" />
    <Path d="M44 22V38M84 22V38" stroke={color} strokeWidth={5} strokeLinecap="round" />
    <Rect x={38} y={64} width={10} height={10} rx={2} fill={color} />
    <Rect x={59} y={64} width={10} height={10} rx={2} fill={color} />
    <Rect x={80} y={64} width={10} height={10} rx={2} fill={color} />
    <Rect x={38} y={82} width={10} height={10} rx={2} fill={color} />
    <Rect x={59} y={82} width={10} height={10} rx={2} fill={color} />
    <Rect x={80} y={82} width={10} height={10} rx={2} fill={color} />
  </Svg>
);

export default Calendar;
