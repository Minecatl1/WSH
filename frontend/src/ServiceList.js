import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('/api/services')
      .then(response => setServices(response.data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const handleServiceAction = (service, action) => {
    axios.post(`/api/services/${service}/${action}`)
      .then(response => alert(`${service} ${action}ed successfully`))
      .catch(error => console.error(`Error ${action}ing ${service}:`, error));
  };

  return (
    <div className="service-list">
      <h2>Installed Services</h2>
      <ul>
        {services.map(service => (
          <li key={service}>
            <span>{service}</span>
            <button onClick={() => handleServiceAction(service, 'start')}>Start</button>
            <button onClick={() => handleServiceAction(service, 'stop')}>Stop</button>
            <button onClick={() => handleServiceAction(service, 'restart')}>Restart</button>
            <button onClick={() => handleServiceAction(service, 'uninstall')}>Uninstall</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
