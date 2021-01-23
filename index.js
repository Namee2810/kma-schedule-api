require('dotenv').config()
const express = require('express')
const app = express()
const port = 8000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
  next();
}
app.use(allowCrossDomain);

app.get("/", (req, res) => {
  res.send("Hi");
})

const login = require('./routes/login');
app.use('/login', login);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})