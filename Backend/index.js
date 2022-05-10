const express = require("express");
const mongoose = require("mongoose");
var routes = require('./routes/routes');
var cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express();
const {socketIOConfig} = require('./Configs/socketIOConfig') 

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
        
var http = require('http').createServer(app);
const port = process.env.PORT || 8080;

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});

socketIOConfig(http);


console.log("Server started");