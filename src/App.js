import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import DataModelDropdown from './DataModelDropdown';
import VariablesDropdown from './VariablesDropdown';
import Select from 'react-select';
import Results from './Results';
import './App.css'; // Import the CSS file

const Main = () => {
    const [dataModels, setDataModels] = useState({});
    const [selectedDataModel, setSelectedDataModel] = useState("");
    const [trainingDatasetOptions, setTrainingDatasetOptions] = useState([]);
    const [validationDatasetOptions, setValidationDatasetOptions] = useState([]);
    const [selectedTrainingDatasets, setSelectedTrainingDatasets] = useState([]);
    const [selectedValidationDatasets, setSelectedValidationDatasets] = useState([]);
    const [selectedX, setSelectedX] = useState([]);
    const [selectedY, setSelectedY] = useState([]);
    const [algorithms, setAlgorithms] = useState([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
    const [selectedAlgorithmType, setSelectedAlgorithmType] = useState(""); // State to store the selected algorithm type
    const [parameters, setParameters] = useState({}); // State to store the parameters of the selected algorithm
    const [parameterValues, setParameterValues] = useState({}); // State to store the values of the parameters
    const [response, setResponse] = useState(null); // State to store the response
    const navigate = useNavigate(); // Use navigate for navigation

    useEffect(() => {
        // Fetch data models
        axios.get('/cdes_metadata')
            .then(response => {
                console.log('Data fetched:', response.data);
                setDataModels(response.data);
            })
            .catch(error => {
                console.error('Error fetching data models:', error);
            });

        // Fetch algorithms
        axios.get('/algorithms')
            .then(response => {
                console.log('Algorithms fetched:', response.data);
                setAlgorithms(response.data);
            })
            .catch(error => {
                console.error('Error fetching algorithms:', error);
            });

        // Fetch datasets locations
        axios.get('/datasets_locations')
            .then(response => {
                console.log('Datasets locations fetched:', response.data);
                // This will be handled inside the handleDataModelSelect function
            })
            .catch(error => {
                console.error('Error fetching datasets locations:', error);
            });
    }, []);

    const handleDataModelSelect = (model) => {
        console.log('Selected Data Model:', model);
        setSelectedDataModel(model);

        const modelVariables = dataModels[model] || {};
        const datasetVariable = modelVariables['dataset'] || {};
        const datasetEnumerations = datasetVariable['enumerations'] || {};
        const datasetKeys = Object.keys(datasetEnumerations);

        // Fetch datasets locations based on selected model
        axios.get('/datasets_locations')
            .then(response => {
                const datasetsLocations = response.data;
                const modelDatasets = datasetsLocations[model] || {};

                const trainingDatasets = [];
                const validationDatasets = [];

                Object.keys(modelDatasets).forEach(dataset => {
                    if (modelDatasets[dataset] === 'globalworker') {
                        validationDatasets.push({ value: dataset, label: dataset });
                    } else {
                        trainingDatasets.push({ value: dataset, label: dataset });
                    }
                });

                setTrainingDatasetOptions(trainingDatasets);
                setValidationDatasetOptions(validationDatasets);
            })
            .catch(error => {
                console.error('Error fetching datasets locations:', error);
            });
    };

    const handleTrainingDatasetSelect = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedTrainingDatasets(selectedValues);
        console.log('Selected Training Datasets:', selectedValues);
    };

    const handleValidationDatasetSelect = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedValidationDatasets(selectedValues);
        console.log('Selected Validation Datasets:', selectedValues);
    };

    const handleXSelect = (variables) => {
        console.log('Selected X Variables:', variables);
        setSelectedX(variables);
    };

    const handleYSelect = (variables) => {
        console.log('Selected Y Variables:', variables);
        setSelectedY(variables);
    };

    const handleAlgorithmSelect = (selectedOption) => {
        console.log('Selected Option:', selectedOption);

        if (selectedOption) {
            const algorithmName = selectedOption.value;
            const algorithmType = selectedOption.type; // Ensure that `type` is part of the selectedOption

            // Find the algorithm that matches both the name and type
            const selectedAlgorithmObject = algorithms.find(algorithm =>
                algorithm.name === algorithmName && algorithm.type === algorithmType
            );

            if (selectedAlgorithmObject) {
                setSelectedAlgorithm(algorithmName);
                setSelectedAlgorithmType(selectedAlgorithmObject.type);
                setParameters(selectedAlgorithmObject.parameters || {});
                setParameterValues({});

                // Debug logs
                console.log('Selected Algorithm:', selectedAlgorithmObject);
            } else {
                console.warn('Algorithm not found:', algorithmName, 'with type:', algorithmType);
            }
        }
    };



    const handleParameterChange = (paramName, value) => {
        setParameterValues(prevValues => ({
            ...prevValues,
            [paramName]: value,
        }));
    };

    const handleSubmit = () => {
        const payload = {
            inputdata: {
                x: selectedX,
                y: selectedY,
                data_model: selectedDataModel,
                datasets: selectedTrainingDatasets,
                validation_datasets: selectedValidationDatasets,
                filters: null,
            },
            parameters: parameterValues, // Include parameter values in the payload
            type: selectedAlgorithmType, // Add the algorithm type to the payload
        };

        const url = `/algorithms/${selectedAlgorithm}`;
        axios.post(url, payload)
            .then(response => {
                console.log('Response:', response.data);
                setResponse(response.data); // Set the response state
                navigate('/results', { state: { response: response.data } }); // Navigate to the results page with response data
            })
            .catch(error => {
                console.error('Error:', error);
                const errorResponse = error.response ? error.response.data : { error: 'An error occurred' };
                setResponse(errorResponse); // Set the response state even on error
                navigate('/results', { state: { response: errorResponse } }); // Navigate to the results page with error data
            });
    };

    const selectedModelVariables = dataModels[selectedDataModel] || {};
    const variableOptions = Object.keys(selectedModelVariables).map(variable => ({
        value: variable,
        label: variable
    }));

    const filteredXOptions = variableOptions.filter(option => !selectedY.includes(option.value));
    const filteredYOptions = variableOptions.filter(option => !selectedX.includes(option.value));

    const algorithmOptions = algorithms.map(algorithm => ({
        value: algorithm.name, // Ensure this matches the 'name' used in your algorithms data
        label: algorithm.label, // Ensure this matches the 'label' used in your algorithms data
        type: algorithm.type
    }));

    return (
        <div className="App">
            <header className="App-header">
                <h1>EXAVIEW</h1>
            </header>
            <main className="App-main">
                <DataModelDropdown onSelect={handleDataModelSelect} />
                {selectedDataModel && (
                    <div className="App-content">
                        <div className="form-group">
                            <label htmlFor="training-dataset">Select Training Datasets: </label>
                            <Select
                                id="training-dataset"
                                isMulti
                                options={trainingDatasetOptions}
                                onChange={handleTrainingDatasetSelect}
                                placeholder="Select training datasets"
                                className="select-dropdown"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="validation-dataset">Select Validation Datasets: </label>
                            <Select
                                id="validation-dataset"
                                isMulti
                                options={validationDatasetOptions}
                                onChange={handleValidationDatasetSelect}
                                placeholder="Select validation datasets"
                                className="select-dropdown"
                            />
                        </div>
                        <VariablesDropdown
                            variables={filteredXOptions}
                            onSelect={handleXSelect}
                            label="X Variables"
                            className="variable-dropdown"
                        />
                        <VariablesDropdown
                            variables={filteredYOptions}
                            onSelect={handleYSelect}
                            label="Y Variables"
                            className="variable-dropdown"
                        />
                        <div className="form-group">
                            <label htmlFor="algorithm">Select Algorithm: </label>
                            <Select
                                id="algorithm"
                                options={algorithmOptions}
                                onChange={handleAlgorithmSelect}
                                placeholder="Select an algorithm"
                            />
                        </div>
                        {Object.keys(parameters).length > 0 && (
                            <div className="form-group">
                                <h3>Parameters</h3>
                                {Object.keys(parameters).map(paramName => (
                                    <div key={paramName} className="parameter-field">
                                        <label htmlFor={paramName}>{parameters[paramName].label}: </label>
                                        <input
                                            type="text"
                                            id={paramName}
                                            value={parameterValues[paramName] || ''}
                                            onChange={(e) => handleParameterChange(paramName, e.target.value)}
                                            placeholder={parameters[paramName].desc}
                                            className="input-field"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={handleSubmit} className="submit-button">Submit</button>
                    </div>
                )}
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </Router>
    );
};

export default App;
