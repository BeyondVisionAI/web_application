const express = require("express");
const mongoose = require("mongoose");
var routes = require('./routes/routes');
var cookieParser = require('cookie-parser')
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
    res.send();
  });
});

routes(app);

var url = "mongodb://beyondvision:thisisaverysecurepassword@mongodb/beyondvision";
console.log("Process.env.DB_CONN_STRING : " + url);

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

.then(() => {
  console.log("Connected to mongo db")
})
.catch(err => {
  console.error("Unable to connect to mongo db", err)
})

const port = process.env.PORT || 8080;
app.listen(port);
console.log("Server started");