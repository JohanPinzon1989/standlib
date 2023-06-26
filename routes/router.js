const express = require("express");
const router = express.Router();

const conexion = require("../src/DB/database");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//Router para registrar los datos
//app.post("/");

module.exports = router;
