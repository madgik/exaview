import React from 'react';

const DatasetDropdown = ({ datasets = [], onSelect, label }) => {
    const handleChange = (event) => {
        onSelect(event.target.value);
    };

    return (
        <div>
            <label htmlFor={label}>{label}: </label>
            <select id={label} onChange={handleChange}>
                <option value="">--Select a Dataset--</option>
                {datasets.map((dataset, index) => (
                    <option key={index} value={dataset}>{dataset}</option>
                ))}
            </select>
        </div>
    );
};

export default DatasetDropdown;
