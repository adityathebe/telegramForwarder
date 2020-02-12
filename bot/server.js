const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config');

// Set up Server
const PORT = process.env.PORT || port;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

////////////
// Routes //
////////////
const homeRoute = require('./routes/home');
const agentRoute = require('./routes/agent');
app.use('/', homeRoute);
app.use('/agent', agentRoute);

if (require.main === module) {
  app.listen(PORT, err => {
    if (err) throw err;
    console.log(`Listening at port ${PORT}`);
  });
}
