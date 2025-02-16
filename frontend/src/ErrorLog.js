import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ErrorLog = () => {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Replace this with your API call to fetch error logs
    axios.get('/api/errors')
      .then(response => setErrors(response.data))
      .catch(error => console.error('Error fetching error logs:', error));
  }, []);

  return (
    <div className="error-log">
      <h2>Error Log</h2>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorLog;
