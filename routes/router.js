const express = require("express");
const router = express.Router();

const conexion = require("../serv/DB/dbreg");
const pais = require("../serv/modulos/pais/rutas");
const usuarios = require("../serv/modulos/usuarios/rutas");
const errors = require("../serv/red/errors");
const login = require("../serv/modulos/usuarios/autenticacion");

router.get("/", login.isAuthenticated, (req, res) => {
  res.render("ESP/index", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("ESP/login", { alert: false });
});

router.get("/register", (req, res) => {
  res.render("ESP/registro_org");
});

//Inicio del menu de usuarios
router.get("/us", (req, res) => {
  conexion.query("SELECT * FROM usuarios", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/usuarios", { results: results });
    }
  });
});
router.get("/cus", (req, res) => {
  let ep1;
  let pu1;
  conexion.query("SELECT * FROM estado_provincia", (error, ep) => {
    if (error) {
      throw error;
    } else {
      ep1 = ep;
      //res.render("ESP/crearUsuarios", { ep: ep });
    }
  });
  conexion.query("SELECT * FROM perfil_usuario", (error, pu) => {
    if (error) {
      throw error;
    } else {
      pu1 = pu;
      //res.render("ESP/crearUsuarios", { pu: pu });
    }
  });
  console.log(ep1);
});
router.get("/wp", (req, res) => {
  res.render("ESP/whitePage");
});

//Router para registrar los datos
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.post("/api/login", login.auth);
router.use(errors);
router.get("/logout", login.logout);

module.exports = router;
