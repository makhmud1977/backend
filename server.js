
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

const PORT = process.env.PORT || 5000
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

// Routes will go here
app.use('/api', apiRoutes);
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
