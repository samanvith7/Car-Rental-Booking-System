import React from 'react';

const Loader = ({ fullScreen, size = 40 }) => {
  const style = fullScreen ? {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-primary)'
  } : {
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px'
  };

  return (
    <div style={style}>
      <div style={{
        width: size, height: size,
        border: '3px solid rgba(255,255,255,0.08)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;
