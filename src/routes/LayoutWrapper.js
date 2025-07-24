import React from 'react';

const wrapperStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '16px',
  width: '100%',
};

const LayoutWrapper = ({ children }) => {
  return <div style={wrapperStyle}>{children}</div>;
};

export default LayoutWrapper;
