import React, { useState, useEffect, useCallback } from 'react';
import type { ColumnState } from '../types';
import Column from './Column';

interface SorobanAbacusProps {
  onValueChange: (value: number) => void;
  reset: boolean;
  numColumns: number;
  className?: string;
  disabled?: boolean;
}

const createInitialState = (cols: number): ColumnState[] => 
  Array(cols).fill({ upper: false, lower: 0 });


const SorobanAbacus: React.FC<SorobanAbacusProps> = ({ onValueChange, reset, numColumns, className, disabled = false }) => {
  const [abacusState, setAbacusState] = useState<ColumnState[]>(() => createInitialState(numColumns));

  const calculateValue = useCallback((state: ColumnState[]): number => {
    return state.reduce((total, column, index) => {
      const placeValue = Math.pow(10, state.length - 1 - index);
      const columnValue = (column.upper ? 5 : 0) + column.lower;
      return total + (columnValue * placeValue);
    }, 0);
  }, []);

  useEffect(() => {
    const value = calculateValue(abacusState);
    onValueChange(value);
  }, [abacusState, onValueChange, calculateValue]);
  
  useEffect(() => {
      if (reset) {
          setAbacusState(createInitialState(numColumns));
      }
  }, [reset, numColumns]);

  useEffect(() => {
    setAbacusState(createInitialState(numColumns));
  }, [numColumns]);

  const handleUpperClick = (colIndex: number) => {
    if (disabled) return;
    setAbacusState(prevState => 
      prevState.map((col, i) => 
        i === colIndex ? { ...col, upper: !col.upper } : col
      )
    );
  };

  const handleLowerClick = (colIndex: number, beadIndex: number) => {
    if (disabled) return;
    setAbacusState(prevState => {
      const currentColumn = prevState[colIndex];
      const isBeadActive = beadIndex < currentColumn.lower;
      const newLowerValue = isBeadActive ? beadIndex : beadIndex + 1;
      
      return prevState.map((col, i) =>
        i === colIndex ? { ...col, lower: newLowerValue } : col
      );
    });
  };

  return (
    <div className={`bg-[#8B4513] p-6 rounded-2xl shadow-2xl border-4 border-amber-900 inline-block transition-opacity duration-300 ${className || ''} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="flex justify-center space-x-4">
        {abacusState.map((colState, i) => (
          <Column
            key={i}
            state={colState}
            onUpperClick={() => handleUpperClick(i)}
            onLowerClick={(beadIndex) => handleLowerClick(i, beadIndex)}
            colorIndex={numColumns - 1 - i}
          />
        ))}
      </div>
    </div>
  );
};

export default SorobanAbacus;