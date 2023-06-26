const jwt = require("jsonwebtoken");
const config = require("../auth");

const secret = process.env.JWT;

function asignarToken(data) {
  return jwt.sign(data, secret);
}

module.exports = {
  asignarToken,
};
