import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Results.css'; // Import a CSS file for custom styles

const formatObjectAsTable = (obj) => {
    if (Array.isArray(obj)) {
        return (
            <table>
                <thead>
                <tr>
                    {Object.keys(obj[0]).map(key => (
                        <th key={key}>{key}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {obj.map((item, index) => (
                    <tr key={index}>
                        {Object.values(item).map((value, idx) => (
                            <td key={idx}>{value}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    } else if (typeof obj === 'object') {
        return (
            <table>
                <tbody>
                {Object.entries(obj).map(([key, value]) => (
                    <tr key={key}>
                        <th>{key}</th>
                        <td>{formatObjectAsTable(value)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
    return <span>{obj}</span>;
};

const Results = () => {
    const location = useLocation();
    const { response } = location.state || { response: {} };

    return (
        <div className="results-container">
            <h1>Results</h1>
            <div className="results-content">
                {formatObjectAsTable(response)}
            </div>
            <Link to="/">
                <button className="home-button">Home</button>
            </Link>
        </div>
    );
};

export default Results;
