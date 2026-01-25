import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PremiumIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const PremiumIcon: React.FC<PremiumIconProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#ffffff' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 17.7 6.8 19.8l1-5.9-4.3-4.2 5.9-.9L12 3.5Z"
        stroke={color} 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
    </Svg>
  );
};
