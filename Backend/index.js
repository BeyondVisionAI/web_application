const express = require("express");
const mongoose = require("mongoose");
var routes = require('./Routes/routes');
var cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.WEBSITE_URL,
    credentials: true,
    optionsSuccessStatus: 200
  })
);

routes(app);

mongoose.connect(
  process.env.DB_CONN_STRING,
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