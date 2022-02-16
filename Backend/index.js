const express = require("express");
const mongoose = require("mongoose");
var routes = require('./routes/routes');
var cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost",
    credentials: true,
    optionsSuccessStatus: 200
  })
);
console.log("new v with cors");

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