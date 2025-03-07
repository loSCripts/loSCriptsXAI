import React from 'react';

interface PerspectiveGridProps {
  darkMode: boolean;
}

const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({ darkMode }) => {
  return (
    <div className="perspective-grid">
      <div className="grid-container">
        <div className="grid-lines"></div>
      </div>
    </div>
  );
};

export default PerspectiveGrid;