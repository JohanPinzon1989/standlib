const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");
const { render } = require("ejs");

const Table = "documentos";

module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../../DB/database");
  }

  function getAll() {
    return db.getAll(Table);
  }

  function find(id) {
    return db.find(Table, id);
  }

  async function add(req, res, next) {
    const { body, file } = req;
    var fecha = require("moment");
    var ahora = fecha().format("YYYY-MM-DD");

    const documento = {
      Id: 0,
      Nombre: body.Nombre,
      Abreviacion: body.Abreviacion,
      Descripcion: body.Descripcion,
      Descripcion_ing: body.Descripcion_ing,
      Fecha_carga: `${ahora}`,
      Fecha_vigencia: `${ahora}`,
      Estado: "Activo",
      link: `file/uploaders/${file.filename}`,
    };
    console.log(documento);
    const result = await db.agregar(Table, documento);
    res.render("ESP/index");
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    add,
    del,
  };
};
