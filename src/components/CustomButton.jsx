import React from 'react';
import './CustomButton.scss';

const CustomButton = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-button ${variant} ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;