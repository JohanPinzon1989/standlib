const { Console } = require("console");

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

  // Asinar documento a factura
  async function asignarF(req, res) {
    const { body } = req;
    console.log(body);
    let fact = body.Factura
    let ten
    const tena = await db.find("historial_facturacion", fact);
    for (var count = 0; count < tena.length; count++) {
      ten = await tena[count].Tenant_Id;
    }
    console.log(ten)
    for (var count = 0; count < body.Documento.length; count++) {
      const asignacion = {
        IdTenant: ten,
        IdDocumentos: body.Documento[count],
        IdFactura: fact,
      }
      console.log(asignacion)

      //Valida si el doscumento ya fue asignado
      const asig = await db.findAD("facturacion_documentos", asignacion);
      let docFact;
      for (var count1 = 0; count1 < asig.length; count1++) {
        docFact = await asig[count1].Id;
      }
      console.log(docFact);
      if (docFact > 0) {
        console.log("ya fue asignado");
      } else {
        //Enviar datos a Base de Datos
        console.log("Registrado");
        const result = await db.agregar("facturacion_documentos", asignacion);
      }
    }
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
    asignarF,
  };
};
