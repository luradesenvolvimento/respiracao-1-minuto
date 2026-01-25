import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HistoryIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const HistoryIcon: React.FC<HistoryIconProps> = ({
  width = 24,
  height = 24,
  color = '#ffffff'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21a9 9 0 1 0-9-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M3 12v-3m0 3h3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7v5l3 2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
