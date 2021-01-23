const express = require('express');
const router = express.Router();
const login = require("../modules/login");

router.post('/', (req, res) => {
  login(req.body.username, req.body.password)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;