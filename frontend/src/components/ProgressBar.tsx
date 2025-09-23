// /assessment_engine/frontend/components/ProgressBar.tsx

import React from 'react';

interface Props {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: Props) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
      borderRadius: '12px',
      overflow: 'visible',
      height: '22px',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(0, 87, 134, 0.07)',
      position: 'relative',
      border: '1.5px solid #b2ebf2',
    }}>
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          background: 'repeating-linear-gradient(135deg, #007bff 0 16px, #00c6fb 16px 32px)',
          borderRadius: '12px',
          boxShadow: '0 0 8px #00c6fb55',
          transition: 'width 0.5s cubic-bezier(.4,2,.6,1)',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1,
          animation: 'progress-stripes 1.2s linear infinite',
          backgroundSize: '40px 40px',
        }}
      ></div>
      {/* Floating percentage label */}
      <div
        style={{
          position: 'absolute',
          left: `calc(${percentage}% - 32px)`,
          top: '-32px',
          minWidth: '64px',
          textAlign: 'center',
          color: '#007bff',
          fontWeight: 700,
          fontSize: '1.1rem',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 87, 134, 0.07)',
          padding: '2px 8px',
          zIndex: 2,
          transition: 'left 0.5s cubic-bezier(.4,2,.6,1)',
        }}
      >
        {Math.round(percentage)}%
      </div>
      {/* Keyframes for animated stripes */}
      <style>{`
        @keyframes progress-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
      `}</style>
    </div>
  );
};