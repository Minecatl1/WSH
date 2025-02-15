const express = require('express');
const app = express();
const exec = require('child_process').exec;
const axios = require('axios');

// Routes for service management
app.get('/api/services', (req, res) => {
  const services = ['protodactyl', 'plex', 'homeassistant'];
  res.json(services);
});

app.post('/api/services/:service/start', (req, res) => {
  const service = req.params.service;
  exec(`docker start ${service}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error starting ${service}: ${error.message}`);
    res.send(`${service} started successfully`);
  });
});

app.post('/api/services/:service/stop', (req, res) => {
  const service = req.params.service;
  exec(`docker stop ${service}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error stopping ${service}: ${error.message}`);
    res.send(`${service} stopped successfully`);
  });
});

// Placeholder route for media store integration
app.get('/api/media', async (req, res) => {
  try {
    // Replace with actual cloud storage API integration
    const mediaFiles = await axios.get('<cloud_storage_api_url>');
    res.json(mediaFiles.data);
  } catch (error) {
    res.status(500).send(`Error fetching media: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
