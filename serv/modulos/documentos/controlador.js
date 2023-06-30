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

  async function agregar(body) {
    var fecha = require("moment");
    var ahora = moment().format("YYYY-MM-DD");

    const documento = {
      Id: body.ID,
      Nombre: body.Nombre,
      Abreviacion: body.Abreviacion,
      Descripcion: body.Descripcion,
      Descripcion_ing: body.Descripcion_ing,
      Fecha_carga: ahora,
      Fecha_vigencia: "",
      Estado: "Activo",
      link: "",
    };
    console.log(documento);
    return db.agregar(Table, usuario);
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
