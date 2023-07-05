const express = require("express");
const { route } = require("../../../cliente/app");
const respuetas = require("../../red/respuestas");
const controlador = require("./index");

const router = express.Router();

router.get("/", getAll);
router.get("/:Id", find);
router.post("/", agregar);
router.put("/", del);

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
  try {
    const items = await controlador.agregar(req.body);
    if (req.body.Id == Null) {
      respuetas.success(req, res, "Item guardado", 201);
    } else {
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
