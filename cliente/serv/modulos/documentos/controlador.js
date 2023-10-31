const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use, link } = require("./rutas");
const { render } = require("ejs");
const ExcelJS = require("exceljs");
const pdf = require('pdf-poppler');
const fs = require('fs');
const path = require('path');
const { error } = require("console");

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

  //Crear carpetas

  async function crearFolder(req, res) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(
      "C:\\Users\\johan.pinzon\\Videos\\PY\\standlib\\cliente\\public\\file\\Excel\\Listar archivos.xlsm"
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
        column2,
        Link,
        Organismo,
        column4,
        Nombre,
        Version,
        Año,
        TipoPago,
        Link2,
      ] = row; // Campos de excel
      /*console.log(column1);
      console.log(column2.text);
      console.log(Link.result);
      console.log(Organismo.result);
      console.log(column4.result);
      console.log(Nombre.result);
      console.log(Version.result);
      console.log(Año.result);
      console.log(TipoPago.result);
      console.log(Link2);
      console.log("Nombre carpeta: "+Nombre.result+"_"+Version.result+"_"+Año.result);*/
      let rutaPDF = column2.text;
      const rutaOrganismo = path.join('C:/Users/johan.pinzon/Videos/PY/standlib/cliente/public/file/img/', Organismo.result);
      const rutaCompleta = path.join('C:/Users/johan.pinzon/Videos/PY/standlib/cliente/public/file/img/'+Organismo.result+'/', Nombre.result+"_"+Version.result+"_"+Año.result);
      
      // Verificar si la carpeta ya existe
      if (!fs.existsSync(rutaOrganismo)){
        fs.mkdirSync(rutaOrganismo);
        console.log('Carpeta '+Organismo.result+' creada');
        if (!fs.existsSync(rutaCompleta)) {
          fs.mkdirSync(rutaCompleta);
          console.log('Carpeta '+Nombre.result+"_"+Version.result+"_"+Año.result +' creada');
          convertPDF(rutaPDF,rutaCompleta,Nombre.result);
        } else {
          console.log('La carpeta '+Nombre.result+"_"+Version.result+"_"+Año.result+' ya existe.');
          convertPDF(rutaPDF,rutaCompleta,Nombre.result);
        }
      }else{
        console.log('La carpeta '+Organismo.result+' ya existe.');
        if (!fs.existsSync(rutaCompleta)) {
          fs.mkdirSync(rutaCompleta);
          console.log('Carpeta '+Nombre.result+"_"+Version.result+"_"+Año.result +' creada');
          convertPDF(rutaPDF,rutaCompleta,Nombre.result);
        } else {
          console.log('La carpeta '+Nombre.result+"_"+Version.result+"_"+Año.result+' ya existe.');
          convertPDF(rutaPDF,rutaCompleta,Nombre.result);
        }
      }
    }
    return console.log("Proceso terminado");
  }

  //Convertir pdf en imagenes
  async function convertPDF(pdfRoute,RutaSalida,NombrePdf) {
    
      
      const pdfPath = pdfRoute; // Replace with the path to your source PDF file
      const outputDir = RutaSalida; // Replace with the directory where you want to save the images
      const NombreP = NombrePdf
      console.log(pdfPath);
      console.log(outputDir);
      console.log("Nombre de la imagen "+NombreP);

      const convertOptions = {
        format: 'webp', // You can use other formats like 'png', 'tiff', etc.
        out_dir: outputDir,
        out_prefix: NombreP, // Prefix for image filenames
      };

      pdf.convert(pdfPath, convertOptions)
        .then((info) => {
          console.log('Conversion successful');
          console.log(info);
          return console.log("Convercion terminada");

        })
        .catch((error) => {
          console.error('Error converting PDF to images:', error);
        });

        fs.readdir(outputDir, function (err, archivos) {
          if (err) {
          onError(err);
          return;
          }
          console.log(archivos);
          });
    
    return console.log("Convercion terminada");
  }


  async function uploadData(res, req) {
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(
      "C:\\Users\\johan.pinzon\\Videos\\PY\\standlib\\cliente\\public\\file\\Excel\\Listar archivos.xlsm"
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
        column2,
        Link,
        Organismo,
        column4,
        Nombre,
        Version,
        Año,
        TipoPago,
        Link2,
      ] = row; // Campos de excel
      /*console.log(column1);
      console.log(column2.result);
      console.log(Link.result);
      console.log(Organismo.result);
      console.log(column4.result);
      console.log(Nombre.result);
      console.log(Version.result);
      console.log(Año.result);
      console.log(TipoPago.result);
      console.log(Link2);*/
      const resul = await db.findDoc(Table, Nombre.result);
      let cont = 0;

      for (var count = 0; count < resul.length; count++) {
        let doc = await resul[count];
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
          linkDoc: Link.result,
          LinkImagen: null,
          Autor: Organismo.result,
          Pago: TipoPago.result,
        };
        const result = await db.agregar(Table, documento);
      } else {
        console.log("Ya esta cargado el documento " + Nombre.result);
      }
    }
    res.redirect("/lDoc");
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
    convertPDF,
    crearFolder,
  };
};
