// src/components/FormInput.tsx
import React from 'react';
import './FormInput.css';

interface FormInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ name, label, value, onChange, error }) => {
  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormInput;
