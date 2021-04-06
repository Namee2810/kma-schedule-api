const express = require('express');
const { generateAccessToken } = require('../modules/jwt');
const router = express.Router();
const login = require("../modules/login");
const test = require("../modules/test.json");

const tokenTest = generateAccessToken(test)

router.post('/', (req, res) => {
  if (req.body.username === "test" && req.body.password === "test")
    return res.json({
      status: 200,
      token: tokenTest
    });
  login(req.body.username, req.body.password)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;