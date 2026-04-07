"use client";

function ShapeElement({ shape, color, fillMode }) {
  const fill = fillMode === 'solid' ? color : 'none';
  const stroke = color;
  const sw = fillMode === 'solid' ? 1.5 : 5;

  switch (shape) {
    case 'circle':
      return <circle cx="50" cy="50" r="40" fill={fill} stroke={stroke} strokeWidth={sw} />;
    case 'square':
      return <rect x="10" y="10" width="80" height="80" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />;
    case 'triangle':
      return <polygon points="50,8 93,88 7,88" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case 'star':
      return <polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case 'heart':
      return <path d="M50,85 C25,65 5,50 5,30 C5,14 16,5 30,5 C40,5 47,11 50,18 C53,11 60,5 70,5 C84,5 95,14 95,30 C95,50 75,65 50,85Z" fill={fill} stroke={stroke} strokeWidth={sw} />;
    case 'diamond':
      return <polygon points="50,5 95,50 50,95 5,50" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case 'arrow':
      return <polygon points="8,35 58,35 58,12 95,50 58,88 58,65 8,65" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
  }
}

export default function VisualShapeIcon({ item, className = 'visual-shape-svg' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ transform: `scale(${item.size}) rotate(${item.rotation}deg)` }}
    >
      <ShapeElement shape={item.shape} color={item.color} fillMode={item.fill} />
    </svg>
  );
}
