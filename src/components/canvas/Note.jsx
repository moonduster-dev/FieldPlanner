import { Group, Rect, Text } from 'react-konva';

/**
 * Note Component
 * Draws a note box with text that can be placed on the field
 *
 * @param {Object} props
 * @param {string} props.text - Note text content
 * @param {string} props.color - Note background color
 */
const Note = ({
  text = 'Note',
  color = '#fef3c7', // Light yellow default
}) => {
  // Calculate dimensions based on text
  const fontSize = 11;
  const padding = 8;
  const maxWidth = 150;

  // Estimate text dimensions
  const charWidth = fontSize * 0.55;
  const lineHeight = fontSize * 1.3;

  // Word wrap calculation
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = testLine.length * charWidth;

    if (testWidth > maxWidth - padding * 2) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);

  // Calculate box dimensions
  const longestLine = lines.reduce((max, line) =>
    Math.max(max, line.length * charWidth), 0);
  const boxWidth = Math.min(maxWidth, longestLine + padding * 2 + 4);
  const boxHeight = lines.length * lineHeight + padding * 2;

  return (
    <Group>
      {/* Note background */}
      <Rect
        x={-boxWidth / 2}
        y={-boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        fill={color}
        stroke="#d97706"
        strokeWidth={1}
        cornerRadius={4}
        shadowColor="black"
        shadowBlur={3}
        shadowOpacity={0.2}
        shadowOffsetX={1}
        shadowOffsetY={1}
      />

      {/* Note text */}
      <Text
        x={-boxWidth / 2 + padding}
        y={-boxHeight / 2 + padding}
        text={text}
        fontSize={fontSize}
        fill="#92400e"
        width={boxWidth - padding * 2}
        lineHeight={1.3}
      />
    </Group>
  );
};

export default Note;
