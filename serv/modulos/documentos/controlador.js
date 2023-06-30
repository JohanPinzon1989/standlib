const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");

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

  async function agregar(req, res) {
    const { body, file } = req;
    var fecha = require("moment");
    var ahora = fecha().format("YYYY-MM-DD");

    const documento = {
      Id: body.ID,
      Nombre: body.Nombre,
      Abreviacion: body.Abreviacion,
      Descripcion: body.Descripcion,
      Descripcion_ing: body.Descripcion_ing,
      Fecha_carga: ahora,
      Fecha_vigencia: "",
      Estado: "Activo",
      link: `file/uploaders/${file.filename}`,
    };
    console.log(documento);
    return db.agregar(Table, documento);
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregar,
    del,
  };
};
