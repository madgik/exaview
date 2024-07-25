import React from 'react';
import Select from 'react-select';

const VariablesDropdown = ({ variables = [], onSelect, label }) => {
    const handleChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        console.log(`Selected ${label} Values:`, selectedValues);
        onSelect(selectedValues);
    };

    console.log(`Variables for ${label}:`, variables);

    return (
        <div>
            <label htmlFor={label}>{label}: </label>
            <Select
                id={label}
                isMulti
                options={variables}
                onChange={handleChange}
            />
        </div>
    );
};

export default VariablesDropdown;
