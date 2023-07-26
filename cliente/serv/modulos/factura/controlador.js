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

  async function asignarF(req, res) {
    const { body } = req;
    console.log(body);

    //Capturar los dos ultimos registros
    const dataArray = Object.entries(body);
    const lastTwoElements = dataArray.slice(-2);
    const updatedDataObj = Object.fromEntries(lastTwoElements);

    // Capturar los datos de los documentos
    const dataArray1 = Object.entries(body);
    dataArray1.splice(-2);
    const updatedDataObj1 = Object.fromEntries(dataArray1);

    //Ordenar los datos de documentos
    const dataObj = updatedDataObj1;

    for (const key in dataObj) {
      if (dataObj.hasOwnProperty(key)) {
        const value = await dataObj[key];

        //Capturar los datos a registrar
        const asignacion = await {
          Id: null,
          IdTenant: updatedDataObj.IdTenant,
          IdDocumentos: key,
          IdFactura: updatedDataObj.IdFactura,
        };
        console.log(asignacion);

        //Valida si el doscumento ya fue asignado
        const asig = await db.findAD("facturacion_documentos", asignacion);
        let docFact;
        for (var count = 0; count < asig.length; count++) {
          docFact = await asig[count].Id;
        }
        console.log(docFact);
        if (docFact > 0) {
          console.log("ya fue asignado");
        } else {
          //Enviar datos a Base de Datos
          const result = await db.agregar("facturacion_documentos", asignacion);
        }
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
