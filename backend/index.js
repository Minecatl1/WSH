const express = require('express');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const app = express();

app.use(express.json());

let apps;

// Load the app data from the JSON file
fs.readFile(path.join(__dirname, 'apps.json'), 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading apps.json:', err);
    process.exit(1);
  }
  apps = JSON.parse(data);
});

// Route to get the list of available apps
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// Route to install an app
app.post('/api/install', (req, res) => {
  const appName = req.body.name;
  const appInputs = req.body.inputs;
  const app = apps.find(a => a.name === appName);

  if (!app) {
    return res.status(404).send('App not found');
  }

  // Replace placeholders in the compose template with input values
  let composeConfig = app.composeTemplate;
  Object.keys(appInputs).forEach(key => {
    const value = appInputs[key];
    const placeholder = `{${key}}`;
    composeConfig = composeConfig.replace(placeholder, value);
  });

  const dockerComposeFilePath = path.join(__dirname, '..', 'docker-compose.yml');

  fs.appendFile(dockerComposeFilePath, composeConfig, (err) => {
    if (err) {
      return res.status(500).send('Error updating Docker Compose file');
    }

    exec('docker-compose up -d', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send(`Error running Docker Compose: ${error.message}`);
      }

      res.send('App installed successfully');
    });
  });
});

// Route to start a service
app.post('/api/services/:service/start', (req, res) => {
  const service = req.params.service;
  exec(`docker start ${service}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error starting ${service}: ${error.message}`);
    res.send(`${service} started successfully`);
  });
});

// Route to stop a service
app.post('/api/services/:service/stop', (req, res) => {
  const service = req.params.service;
  exec(`docker stop ${service}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error stopping ${service}: ${error.message}`);
    res.send(`${service} stopped successfully`);
  });
});

// Route to restart a service
app.post('/api/services/:service/restart', (req, res) => {
  const service = req.params.service;
  exec(`docker restart ${service}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error restarting ${service}: ${error.message}`);
    res.send(`${service} restarted successfully`);
  });
});

// Route to uninstall a service
app.post('/api/services/:service/uninstall', (req, res) => {
  const service = req.params.service;
  exec(`docker rm -f ${service}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error uninstalling ${service}: ${error.message}`);

    // Remove the service configuration from docker-compose.yml
    const dockerComposeFilePath = path.join(__dirname, '..', 'docker-compose.yml');
    fs.readFile(dockerComposeFilePath, 'utf8', (readErr, data) => {
      if (readErr) return res.status(500).send('Error reading Docker Compose file');

      const updatedConfig = data.replace(new RegExp(`\\n\\s*${service}:.*?(?=\\n\\w|\\n*$)`, 'gs'), '');
      fs.writeFile(dockerComposeFilePath, updatedConfig, (writeErr) => {
        if (writeErr) return res.status(500).send('Error updating Docker Compose file');
        res.send('Service uninstalled successfully');
      });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});