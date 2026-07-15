import React from 'react';

type GoogleIconProps = {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
  fill?: boolean;
};

export default function GoogleIcon({ 
  name, 
  className = '', 
  size = 24, 
  style = {},
  fill = false
}: GoogleIconProps) {
  const fontVariationSettings = fill ? "'FILL' 1" : "'FILL' 0";

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        userSelect: 'none',
        fontVariationSettings,
        ...style
      }}
    >
      {name}
    </span>
  );
}
