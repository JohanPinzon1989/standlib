const Table = "tenant";

module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../DB/database");
  }

  function getAll() {
    return db.getAll(Table);
  }

  function find(id) {
    return db.find(Table, id);
  }

  function agregar(body) {
    return db.agregar(Table, body);
  }

  function del(body) {
    return db.del(Table, body.Id);
  }

  async function actualizarT(req, res) {
    const { body } = req;
    const tenant = {
      Id: body.Id,
      Nombre_org: body.Nombre_org,
      Nom_Contacto: body.Nom_Contacto,
      Dominio: body.Dominio,
      Tel_contacto: body.Tel_contacto,
      EmailT: body.Email,
      Email_facturacion: body.Email_facturacion,
      Estado: body.Estado,
    };
    const result = await db.actualizar(Table, tenant);
    res.redirect("/cli");
  }
  return {
    getAll,
    find,
    agregar,
    del,
    actualizarT,
  };
};
