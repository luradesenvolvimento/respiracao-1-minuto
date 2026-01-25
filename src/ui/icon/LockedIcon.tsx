import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LockedIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const LockedIcon: React.FC<LockedIconProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#ffffff' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <Path 
        d="M7 10h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      <Path 
        d="M12 14v3" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Svg>
  );
};
