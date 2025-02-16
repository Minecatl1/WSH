import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppStore = () => {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    axios.get('/api/apps')
      .then(response => setApps(response.data))
      .catch(error => console.error('Error fetching apps:', error));
  }, []);

  const handleInputChange = (e, inputName) => {
    setInputs({ ...inputs, [inputName]: e.target.value });
  };

  const handleInstall = (app) => {
    setSelectedApp(app);
    setInputs({});
  };

  const handleSubmit = () => {
    axios.post('/api/install', { name: selectedApp.name, inputs })
      .then(response => {
        alert(`${selectedApp.name} installed successfully`);
        setSelectedApp(null);
      })
      .catch(error => console.error(`Error installing ${selectedApp.name}:`, error));
  };

  return (
    <div>
      <h1>App Store</h1>
      {selectedApp ? (
        <div>
          <h2>Install {selectedApp.name}</h2>
          {selectedApp.inputs.map(input => (
            <div key={input.name}>
              <label>{input.placeholder}</label>
              <input
                type="text"
                value={inputs[input.name] || ''}
                onChange={(e) => handleInputChange(e, input.name)}
              />
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <ul>
          {apps.map(app => (
            <li key={app.name}>
              <h2>{app.name}</h2>
              <p>{app.description}</p>
              <button onClick={() => handleInstall(app)}>Install</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppStore;
