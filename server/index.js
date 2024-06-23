'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const ba = require('blockapps-rest');
const { rest, common } = ba;
const { config, util, fsutil } = common;

const app = express();

// Load deployment configuration
const deployConfigPath = path.join(__dirname, config.deployFilename);
if (!fs.existsSync(deployConfigPath)) {
  throw new Error(`Deploy config file not found: ${deployConfigPath}`);
}
const deploy = fsutil.yamlSafeLoadSync(deployConfigPath, config.apiDebug);
console.log('Deploy:', deploy);
app.set('deploy', deploy);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Static assets directory for documentation
// Uncomment this line if you want to serve static files from the 'doc' directory
// app.use(express.static(path.join(__dirname, '../doc')));

// Set up API routes
const routes = require('./routes');
app.use('/', routes);

// Get the intended port number, use port 3031 if not provided
const port = process.env.PORT || 3031;

app.listen(port, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`App listening on port ${port}`);
  }
});

module.exports = app;
