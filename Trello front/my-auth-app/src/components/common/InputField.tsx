import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value,placeholder, error, onChange }) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <input type={type} name={name} value={value} placeholder={placeholder} onChange={onChange} />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default InputField;
