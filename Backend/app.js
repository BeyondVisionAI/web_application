const express = require('express');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
    res.send();
  });
});

var routes = require('./routes/routes');
routes(app);

const port = process.env.PORT || 8080;
app.listen(port);
console.log('App is listening on port ' + port);
