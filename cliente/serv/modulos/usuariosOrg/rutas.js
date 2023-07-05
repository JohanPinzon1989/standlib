const express = require("express");
const { route } = require("../../../app");
const respuetas = require("../../red/respuestas");
const controlador = require("./index");

const router = express.Router();

router.get("/login", login);
//router.get("/", getAll);
//router.get("/:Id", find);
router.get("/", buscar);
router.post("/", agregar);
router.put("/", del);

async function login(req, res, next) {
  try {
    const token = await controlador.login(req.body.username, req.body.password);
    respuetas.success(req, res, token, 200);
  } catch (err) {
    next(err);
  }
}

async function buscar(req, res, next) {
  console.log(req.body);
  try {
    const items = await controlador.buscar(req.body);
    if (req.body.Id == 0) {
      res.redirect("/lUser");
      respuetas.success(req, res, items, 200);
    } else {
      res.redirect("/EUser");
      respuetas.success(req, res, items, 200);
    }
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const items = await controlador.getAll();
    respuetas.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function find(req, res, next) {
  try {
    const items = await controlador.find(req.params.Id);
    respuetas.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function agregar(req, res, next) {
  console.log(req.body);
  try {
    const items = await controlador.agregar(req.body);
    if (req.body.Id == 0) {
      res.redirect("/lUser");
      respuetas.success(req, res, "Item guardado", 201);
    } else {
      res.redirect("/lUser");
      respuetas.success(req, res, "Item actualizado", 201);
    }
  } catch (err) {
    next(err);
  }
}

async function del(req, res, next) {
  try {
    const items = await controlador.del(req.body);
    respuetas.success(req, res, "Item eliminado", 200);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
