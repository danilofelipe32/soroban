
import React from 'react';
import type { ColumnState } from '../types';
import Bead from './Bead';

interface ColumnProps {
  state: ColumnState;
  onUpperClick: () => void;
  onLowerClick: (beadIndex: number) => void;
  colorIndex: number;
}

const Column: React.FC<ColumnProps> = ({ state, onUpperClick, onLowerClick, colorIndex }) => {
  return (
    <div className="relative flex flex-col items-center w-16">
      {/* Rod */}
      <div className="absolute top-0 bottom-0 w-2 bg-amber-800 rounded-full z-0 left-1/2 -translate-x-1/2"></div>
      
      {/* Beads Container */}
      <div className="z-10">
        {/* Upper Bead */}
        <div className="h-20 flex items-end">
          <Bead 
            isActive={state.upper} 
            onClick={onUpperClick} 
            isUpper={true} 
            colorIndex={colorIndex}
          />
        </div>
        
        {/* Reckoning Bar */}
        <div className="h-3 w-20 bg-amber-900 rounded-md shadow-lg my-3"></div>
        
        {/* Lower Beads */}
        <div className="flex flex-col space-y-1 h-72">
          {[...Array(4)].map((_, i) => (
            <Bead 
              key={i} 
              isActive={i < state.lower} 
              onClick={() => onLowerClick(i)}
              isUpper={false}
              colorIndex={colorIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Column;