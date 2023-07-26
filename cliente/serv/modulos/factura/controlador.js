const Table = "Historial_facturacion";

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

  function agregarF(body) {
    return db.agregar(Table, body);
  }
  async function actualizarF(req, res) {
    const { body } = req;
    const factura = {
      Id: body.Id,
      Fecha_inicio: body.Fecha_inicio,
      Fecha_fin: body.Fecha_fin,
      CostoUSD: body.CostoUSD,
      CostoCOP: body.CostoCOP,
    };
    const result = await db.actualizar(Table, factura);
    res.redirect("/Fcli");
  }

  async function delF(body) {
    const result = await db.del(Table, body.Id);
    res.redirect("/Fcli");
  }
  return {
    getAll,
    find,
    agregarF,
    delF,
    actualizarF,
  };
};
