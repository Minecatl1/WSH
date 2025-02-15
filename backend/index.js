const express = require('express');
const app = express();
const exec = require('child_process').exec;
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const mediaFolders = [
  './media/movies',
  './media/tvshows',
  './media/music'
];

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

// Search media in specified folders
app.get('/api/media/search', async (req, res) => {
  const searchQuery = req.query.q;
  let results = [];

  try {
    for (const folder of mediaFolders) {
      const files = fs.readdirSync(folder);
      files.forEach(file => {
        if (file.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push(path.join(folder, file));
        }
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).send(`Error searching media: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
