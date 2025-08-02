import React, { useState } from 'react';

const InputField = ({ label, id, type = "text", value, onChange, placeholder, required = false, className = "", readOnly = false, disabled = false, min, max }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [tempValue, setTempValue] = useState('');

    const getDateRestrictions = () => {
        const today = new Date().toISOString().split('T')[0];
        if (type === 'date') {
            return { max: today };
        }
        return {};
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        // For numeric fields, if the value is 0, clear it for easier input
        if ((type === 'number' || type === 'text') && value === 0) {
            setTempValue('');
            e.target.value = '';
        }
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        // If the field is empty after blur, set it back to 0 for numeric fields
        if ((type === 'number' || type === 'text') && e.target.value === '') {
            onChange({ target: { value: '0' } });
        }
    };

    const handleChange = (e) => {
        if (isFocused && (type === 'number' || type === 'text') && value === 0) {
            // Use tempValue for the first change after focus
            setTempValue(e.target.value);
            onChange(e);
        } else {
            onChange(e);
        }
    };

    // Determine the display value
    const displayValue = isFocused && (type === 'number' || type === 'text') && value === 0 ? tempValue : value;

    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                min={min}
                max={max}
                {...getDateRestrictions()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

export default InputField; 