import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HomeIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const HomeIcon: React.FC<HomeIconProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#ffffff' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M3 10.5 12 3l9 7.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M6.5 10.5V20a1.5 1.5 0 0 0 1.5 1.5h8A1.5 1.5 0 0 0 17.5 20v-9.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      <Path 
        d="M10 21v-6a2 2 0 0 1 4 0v6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Svg>
  );
};
