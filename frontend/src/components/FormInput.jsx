// src/components/FormInput.jsx
import React from 'react';

function FormInput({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={name} style={{ display: 'block', fontWeight: 'bold' }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}

export default FormInput;
