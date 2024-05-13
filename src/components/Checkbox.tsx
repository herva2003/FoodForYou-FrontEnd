import React, { InputHTMLAttributes, forwardRef, useState } from "react";

// import { Container } from './styles';

interface CheckboxProps {
  // checked: boolean;
  onCheck?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ onCheck }) => {
  const handleCheck = () => {
    setChecked((state) => {
      const newState = !state;

      if (onCheck) {
        onCheck(newState);
      }

      return newState;
    });
  };

  const [checked, setChecked] = useState(false);

  return (
    <div>
      <input type="checkbox" checked={checked} onChange={handleCheck} />
    </div>
  );
};

export default Checkbox;
