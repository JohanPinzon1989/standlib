const express = require("express");
const { route } = require("../../../app");
const respuetas = require("../../red/respuestas");
const controlador = require("./index");

const router = express.Router();

router.get("/login", login);
router.get("/", getAll);
router.get("/:Id", find);
router.post("/", agregar);
router.put("/", del);

async function login(req, res, next) {
  try {
    const token = await controlador.login(req.body.Email, req.body.password);
    respuetas.success(req, res, token, 200);
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

async function findP(req, res, next) {
  try {
    const items = await controlador.find(req.params.Id);
    respuetas.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function agregar(req, res, next) {
  try {
    const items = await controlador.agregar(req.body);
    console.log(req.body.Id);
    console.log(items.Id);
    if (req.body.Id == 0) {
      res.redirect("/login");
      respuetas.success(req, res, "Item guardado", 201);
    } else {
      if (items.Id == 1) {
        res.redirect("/Md");
        respuetas.success(req, res, "Item actualizado", 201);
      } else {
        if (req.body > 0) {
          res.redirect("/Mu");
          respuetas.success(req, res, "Item actualizado", 201);
        }
      }
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
