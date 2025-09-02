
import React, { useRef } from 'react';

interface BeadProps {
  isActive: boolean;
  onClick: () => void;
  isUpper: boolean;
  colorIndex: number;
}

const beadColorPalette = [
  'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 ring-blue-700',      // Ones
  'bg-green-600 hover:bg-green-500 active:bg-green-700 ring-green-700',    // Tens
  'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 ring-yellow-600', // Hundreds
  'bg-red-600 hover:bg-red-500 active:bg-red-700 ring-red-700',        // Thousands
  'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 ring-purple-700',// Ten thousands
];


const Bead: React.FC<BeadProps> = ({ isActive, onClick, isUpper, colorIndex }) => {
  const beadRef = useRef<HTMLDivElement>(null);
  const baseClasses = "w-12 h-12 rounded-full cursor-pointer shadow-inner transition-bead";
  const colorClasses = beadColorPalette[colorIndex % beadColorPalette.length] || beadColorPalette[0];
  
  const positionClasses = isUpper
    ? (isActive ? 'translate-y-10' : '-translate-y-1')
    : (isActive ? '-translate-y-6' : 'translate-y-1');

  const handleBeadClick = () => {
    const beadElement = beadRef.current;
    if (beadElement) {
      beadElement.classList.remove('animate-bead-pulse');
      void beadElement.offsetWidth; // Trigger reflow to restart animation
      beadElement.classList.add('animate-bead-pulse');
      
      beadElement.addEventListener('animationend', () => {
        beadElement.classList.remove('animate-bead-pulse');
      }, { once: true });
    }
    onClick();
  };

  return (
    <div className="h-16 flex items-center justify-center" onClick={handleBeadClick}>
      <div ref={beadRef} className={`${baseClasses} ${colorClasses} ${positionClasses} ring-2`}></div>
    </div>
  );
};

export default Bead;