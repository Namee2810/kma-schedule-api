const jwt = require("jsonwebtoken");

function generateAccessToken(params) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(params, process.env.SECRET_KEY, {});
};
function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //if (token == null) return res.sendStatus(401) // if there isn't any token
  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) return res.json({ status: "invalid" });
    return res.json({ status: "valid" }) // pass the execution off to whatever request the client intended
  });
};

module.exports = { generateAccessToken, authenticateToken };

