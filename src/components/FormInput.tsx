import React from 'react';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: string[];
  required?: boolean;
}

const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  options,
  required = false
}: FormInputProps) => {
  return (
    <div className="mb-6">
      <label 
        htmlFor={name}
        className="block text-xl font-medium text-gray-200 mb-2"
      >
        {label}
      </label>
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full text-xl p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full text-xl p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      )}
    </div>
  );
};

export default FormInput;