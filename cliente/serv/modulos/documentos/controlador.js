const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use, link } = require("./rutas");
const { render } = require("ejs");
const ExcelJS = require("exceljs");

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

  async function uploadData(res, req) {
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(
      "C:\\D\\SOFTMAT\\PROYECTOS - Documentos\\STANDLIB\\DOCUMENTOS\\Listar archivos.xlsm"
    );

    const worksheet = workbook.getWorksheet(1); // Hoja 1

    const data = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Saltar la primera fila si es un encabezado
        data.push(row.values);
      }
    });

    for (const row of data) {
      const [
        column1,
        Link,
        Organismo,
        column4,
        Nombre,
        Version,
        Año,
        TipoPago,
      ] = row; // Ajusta esto según tu hoja de Excel
      const resul = await db.findDoc(Table, Nombre.result);
      let cont = 0;
      
      for (var count = 0; count < resul.length; count++) {
        let doc = await resul[count]
        if (
          doc.Nombre === Nombre.result &&
          doc.Version === Version.result &&
          doc.AnoPublicacion === Año.result &&
          doc.Autor === Organismo.result
        ) {
          cont = 1;
        }
      }
      if (cont < 1) {
        const documento = {
          id: null,
          Nombre: Nombre.result,
          Version: Version.result,
          AnoPublicacion: Año.result,
          Fecha_carga: `${hoy}`,
          Estado: "Activo",
          linkDoc: Link.text,
          LinkImagen: null,
          Autor: Organismo.result,
          Pago: TipoPago.result,
        };
        const result = await db.agregar(Table, documento);
      } else {
        console.log("Ya esta cargado el documento " + Nombre.result);
      }
    }

    //res.result(result);
  }

  async function add(req, res) {
    const { body, file } = req;
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    if (body.Id == null) {
      const documento = {
        id: null,
        Nombre: body.Nombre,
        Version: body.Version,
        AnoPulicacion: body.AnoPublicacion,
        Fecha_carga: `${hoy}`,
        Estado: "Activo",
        linkDoc: `file/uploaders/${file.filename}`,
        LinkImagen: null,
        Autor: body.Autor,
        Pago: body.Pago,
      };
      const result = await db.agregar(Table, documento);
      res.redirect("/lDoc");
    } else {
      const documento = {
        id: body.Id,
        Nombre: body.Nombre,
        Abreviacion: body.Abreviacion,
        Version: body.Version,
        Descripcion: body.Descripcion,
        Descripcion_ing: body.Descripcion_ing,
        Fecha_carga: `${hoy}`,
        Estado: body.Estado,
        linkDoc: `file/uploaders/${file.filename}`,
        LinkImagen: null,
        Autor: body.Autor,
        Pago: body.Pago,
      };
      const result = await db.agregar(Table, documento);
      res.redirect("/lDoc");
    }
  }

  async function actualizar(req, res) {
    const { body } = req;
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const documento = {
      Id: body.Id,
      Nombre: body.Nombre,
      Abreviacion: body.Abreviacion,
      Version: body.Version,
      Descripcion: body.Descripcion,
      Descripcion_ing: body.Descripcion_ing,
      Fecha_carga: `${hoy}`,
      Estado: body.Estado,
      Autor: body.Autor,
      Pago: body.Pago,
    };
    const result = await db.actualizar(Table, documento);
    res.redirect("/lDoc");
  }
  async function actualizarD(req, res) {
    const { body, file } = req;
    console.log(file);
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const documento = {
      Id: body.Id,
      linkDoc: `file/uploaders/${file.filename}`,
    };
    const result = await db.actualizar(Table, documento);
    res.redirect("/lDoc");
  }
  async function actualizarI(req, res) {
    const { body, file } = req;
    console.log(file);
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const documento = {
      Id: body.Id,
      LinkImagen: `file/img/${file.filename}`,
    };
    const result = await db.actualizar(Table, documento);
    res.redirect("/lDoc");
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    add,
    del,
    actualizar,
    actualizarD,
    actualizarI,
    uploadData,
  };
};
