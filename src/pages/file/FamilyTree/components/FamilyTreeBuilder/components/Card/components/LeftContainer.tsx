import React from 'react';
import { LeftContainerProps } from '../types';

const LeftContainer: React.FC<LeftContainerProps> = data => {
  const { isMale, age, birth, death, address, leftColumnWidth } = data.data;

  // Function to split address into multiple lines
  const wrapAddress = (text: string) => {
    if (!text) {
      return [''];
    }

    const maxCharsPerLine = Math.floor((leftColumnWidth - 15) / 6); // Approximate chars per line
    const lines: string[] = [];

    let currentLine = '';
    const words = text.split(' ');

    words.forEach(word => {
      // Check if adding this word would exceed our line length
      if (
        (currentLine + ' ' + word).length <= maxCharsPerLine ||
        currentLine === ''
      ) {
        currentLine = currentLine === '' ? word : currentLine + ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  };

  const addressLines = wrapAddress(address);

  // Calculate how many lines we can display within the height limit
  const lineHeight = 12; // Height per line
  const maxAddressHeight = 40; // Maximum allowed height for address
  const maxLinesVisible = Math.floor(maxAddressHeight / lineHeight);

  // Get only the lines that will fit within our height constraint
  const visibleAddressLines = addressLines.slice(0, maxLinesVisible);
  const hasMoreLines = addressLines.length > maxLinesVisible;

  // If there are more lines than we can show, add ellipsis to the last visible line
  if (hasMoreLines && visibleAddressLines.length > 0) {
    const lastIdx = visibleAddressLines.length - 1;
    const lastLine = visibleAddressLines[lastIdx];
    if (lastLine && lastLine.length > 3) {
      visibleAddressLines[lastIdx] =
        lastLine.substring(0, lastLine.length - 2) + '..';
    } else {
      visibleAddressLines[lastIdx] = lastLine + '..';
    }
  }

  return (
    <g className="left-column">
      <rect
        x={0}
        y={30}
        width={leftColumnWidth}
        height={110}
        fill={isMale ? '#7EADFF' : '#FF96BC'}
      />
      <g className="card-details" fill="black" transform="translate(7, 7)">
        <text y={40} fontSize={12} fontWeight="bold">
          Age: {age}
        </text>
        <text y={57} fontSize={12} fontWeight="bold">
          Birth: {birth}
        </text>
        <text y={74} fontSize={12} fontWeight="bold">
          Death: {death}
        </text>
        <text y={91} fontSize={12} fontWeight="bold">
          Address:
        </text>
        {visibleAddressLines.map((line, index) => (
          <text
            key={index}
            y={105 + index * 12}
            fontSize={10}
            fontWeight="bold"
          >
            {line}
          </text>
        ))}
      </g>
    </g>
  );
};

export default LeftContainer;
