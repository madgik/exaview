import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import DataModelDropdown from './DataModelDropdown';
import VariablesDropdown from './VariablesDropdown';
import Select from 'react-select';
import Results from './Results';

const Main = () => {
  const [dataModels, setDataModels] = useState({});
  const [selectedDataModel, setSelectedDataModel] = useState("");
  const [datasetOptions, setDatasetOptions] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
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
  }, []);

  const handleDataModelSelect = (model) => {
    console.log('Selected Data Model:', model);
    setSelectedDataModel(model);

    const modelVariables = dataModels[model] || {};
    const datasetVariable = modelVariables['dataset'] || {};
    const datasetEnumerations = datasetVariable['enumerations'] || {};
    const datasetKeys = Object.keys(datasetEnumerations);

    setDatasetOptions(datasetKeys.map(key => ({ value: key, label: key })));
  };

  const handleDatasetSelect = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedDatasets(selectedValues);
    console.log('Selected Datasets:', selectedValues);
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
    setSelectedAlgorithm(selectedOption ? selectedOption.value : "");
    const selectedAlgorithmObject = algorithms.find(algorithm => algorithm.name === selectedOption.value);
    setSelectedAlgorithmType(selectedAlgorithmObject ? selectedAlgorithmObject.type : ""); // Set the algorithm type
    setParameters(selectedAlgorithmObject && selectedAlgorithmObject.parameters ? selectedAlgorithmObject.parameters : {}); // Set the parameters, handle null case
    setParameterValues({}); // Reset parameter values
    console.log('Selected Algorithm:', selectedOption ? selectedOption.value : "");
    console.log('Selected Algorithm Type:', selectedAlgorithmObject ? selectedAlgorithmObject.type : "");
    console.log('Selected Algorithm Parameters:', selectedAlgorithmObject ? selectedAlgorithmObject.parameters : {});
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
        datasets: selectedDatasets,
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
    value: algorithm.name,
    label: algorithm.label
  }));

  return (
      <div className="App">
        <h1>EXAVIEW</h1>
        <DataModelDropdown onSelect={handleDataModelSelect} />
        {selectedDataModel && (
            <>
              <div>
                <label htmlFor="dataset">Select Datasets: </label>
                <Select
                    id="dataset"
                    isMulti
                    options={datasetOptions}
                    onChange={handleDatasetSelect}
                    placeholder="Select datasets"
                />
              </div>
              <VariablesDropdown
                  variables={filteredXOptions}
                  onSelect={handleXSelect}
                  label="X Variables"
              />
              <VariablesDropdown
                  variables={filteredYOptions}
                  onSelect={handleYSelect}
                  label="Y Variables"
              />
              <div>
                <label htmlFor="algorithm">Select Algorithm: </label>
                <Select
                    id="algorithm"
                    options={algorithmOptions}
                    onChange={handleAlgorithmSelect}
                    placeholder="Select an algorithm"
                />
              </div>
              {Object.keys(parameters).length > 0 && (
                  <div>
                    <h3>Parameters</h3>
                    {Object.keys(parameters).map((paramName) => (
                        <div key={paramName}>
                          <label htmlFor={paramName}>{parameters[paramName].label}: </label>
                          <input
                              type="text"
                              id={paramName}
                              value={parameterValues[paramName] || ''}
                              onChange={(e) => handleParameterChange(paramName, e.target.value)}
                              placeholder={parameters[paramName].desc}
                          />
                        </div>
                    ))}
                  </div>
              )}
              <button onClick={handleSubmit}>Submit</button>
            </>
        )}
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
