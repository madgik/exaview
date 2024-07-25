# Exaview

This project is a web application for performing data analysis using algorithms. It provides a user interface to select datasets, variables, and algorithms, and submit requests to a backend server for processing. Results are displayed in a user-friendly format.

## Features

- **Dynamic Dropdowns**: Users can select data models, datasets, and algorithms. Datasets and algorithms are fetched from the backend.
- **Multiple Selection**: Users can choose multiple datasets and variables.
- **Algorithm Parameters**: Input fields for algorithm-specific parameters are dynamically generated based on the selected algorithm.
- **CORS Handling**: Proper handling of Cross-Origin Resource Sharing (CORS) for fetching data from backend services.
- **Results Display**: Results are displayed in a structured table format. Includes a button to return to the main page.

## Project Structure

- **Backend**: 
  - The backend is a server providing endpoints to fetch data models, datasets, algorithms, and handle requests for executing algorithms.
  - CORS is configured to allow requests from the frontend.

- **Frontend**:
  - Built with React.
  - Components:
    - `App.js`: Main application component handling routing.
    - `Form.js`: User interface for selecting data models, datasets, and algorithms, and submitting requests.
    - `Results.js`: Displays the results of the algorithm execution in a tabular format.

## Setup

### Backend

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Exareme2**:
   ```
   https://github.com/madgik/exareme2/blob/master/README.md
   ```

   Ensure the server is running at `http://localhost:5000`.

### Frontend

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

## API Endpoints

- **GET `/datasets`**: Fetches available datasets.
- **GET `/datasets_locations`**: Fetches dataset locations.
- **GET `/cdes_metadata`**: Fetches metadata for CDES.
- **GET `/data_models_attributes`**: Fetches attributes for data models.
- **GET `/algorithms`**: Fetches available algorithms.
- **POST `/algorithms/<algorithm_name>`**: Executes the selected algorithm with provided parameters.

## Error Handling

- **CORS Issues**: Ensure CORS is correctly configured on the backend to allow requests from the frontend.
- **Result Display**: Results are formatted and displayed in a table format for clarity.

## Usage

1. **Select Data Model**: Choose a data model from the dropdown.
2. **Select Datasets**: Choose multiple datasets.
3. **Select Variables**: Choose variables for `x` and `y`, ensuring no overlap.
4. **Select Algorithm**: Choose an algorithm and provide any required parameters.
5. **Submit Request**: Submit the request and view the results.

## Notes

- The application is designed to handle different types of results and display them in a user-friendly manner.
- Ensure both backend and frontend are running concurrently for full functionality.