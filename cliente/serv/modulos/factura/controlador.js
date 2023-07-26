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

  async function agregarF(req, res) {
    const { body } = req;
    const factura = {
      Id: null,
      Tenant_Id: body.Nombre_org,
      NumFactura: body.NumFactura,
      Fecha_inicio: body.Fecha_inicio,
      Fecha_fin: body.Fecha_fin,
      Estado: body.Estado,
      CostoUSD: body.CostoUSD,
      CostoCOP: body.CostoCOP,
    };
    const result = await db.agregar(Table, factura);
    res.redirect("/Fcli");
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
