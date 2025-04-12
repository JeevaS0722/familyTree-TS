import React, { FC } from 'react';
import styled from '@mui/material/styles/styled';
import { SxProps, Theme } from '@mui/material/styles';

interface LoaderProps {
  color?: string;
  sx?: SxProps<Theme>;
  text?: string;
  showText?: boolean;
}

const LoaderText = styled('div')<Pick<LoaderProps, 'sx'>>(({ sx }) => ({
  fontSize: '20px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  ...(sx as object),
}));

const LoaderTextWithMargin = styled('span')({
  marginRight: '8px',
});

const AnimatedDots = styled('span')<Pick<LoaderProps, 'color'>>(
  ({ color = '#000' }) => ({
    display: 'inline-block',
    '& span': {
      display: 'inline-block',
      animation: 'blink 1.5s infinite',
      backgroundColor: color,
      width: 5,
      height: 5,
      borderRadius: '50%',
      margin: '0 3px',
    },
    '& span:nth-of-type(1)': { animationDelay: '0s' },
    '& span:nth-of-type(2)': { animationDelay: '0.2s' },
    '& span:nth-of-type(3)': { animationDelay: '0.4s' },
    '@keyframes blink': {
      '0%': { opacity: 0.2 },
      '20%': { opacity: 1 },
      '100%': { opacity: 0.2 },
    },
  })
);

const CommonLoader: FC<LoaderProps> = ({
  color = '#000',
  sx,
  text = 'Loading',
  showText = true,
}) => (
  <LoaderText sx={sx} id="initial-loading">
    {showText && <LoaderTextWithMargin>{text}</LoaderTextWithMargin>}
    <AnimatedDots color={color}>
      <span></span>
      <span></span>
      <span></span>
    </AnimatedDots>
  </LoaderText>
);

export default CommonLoader;
