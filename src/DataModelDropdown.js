import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataModelDropdown = ({ onSelect }) => {
    const [dataModels, setDataModels] = useState({});
    const [selectedModel, setSelectedModel] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/cdes_metadata')
            .then(response => {
                console.log('Data fetched:', response.data);
                setDataModels(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data models:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleChange = (event) => {
        const selected = event.target.value;
        setSelectedModel(selected);
        onSelect(selected);
    };

    if (loading) {
        return <p>Loading data models...</p>;
    }

    if (error) {
        return <p>Error loading data models: {error.message}</p>;
    }

    return (
        <div>
            <label htmlFor="dataModel">Select Data Model: </label>
            <select id="dataModel" value={selectedModel} onChange={handleChange}>
                <option value="">--Select a Data Model--</option>
                {Object.keys(dataModels).map((model, index) => (
                    <option key={index} value={model}>{model}</option>
                ))}
            </select>
        </div>
    );
};

export default DataModelDropdown;
