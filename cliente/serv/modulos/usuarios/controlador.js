const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");

const Table = "usuarios";

module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../../DB/database");
  }

  async function auth(Email, password) {
    console.log(Email, password);
    if (!Email || !password) {
      res.render("login", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y contraseña",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "login",
      });
    } else {
      const data = await db.query(Table, { Email: Email });
      return bcrypt.compare(password, data.password).then((resultado) => {
        if (resultado === true) {
          const id = resultado[0].Id;
          const token = jwt.sign({ Id: Id }, process.env.JWT_SECRETE, {
            expiresIn: process.env.JWT_TIME_EXPIRES,
          });
          console.log("Token: " + token);
          const cookiesOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookiesOptions);
          res.render("login", {
            alert: true,
            alertTitle: "Conexion exitosa",
            alertMessage: "DATOS CORRECTOS!",
            alertIcon: "success",
            showConfirmButton: true,
            timer: 800,
            ruta: "",
          });
          //return auth.asignarToken({ ...data });
        } else {
          throw new Error("informacion invalida");
        }
      });
    }
  }

  function getAll() {
    return db.getAll(Table);
  }

  function getAllP() {
    return db.getAllP();
  }

  function find(id) {
    return db.find(Table, id);
  }

  async function agregarCLi(req, res) {
    const { body } = req;
    const usuario = {
      Id: null,
      Nombre: body.Nombre,
      Apellido: body.Apellido,
      Email: body.Email,
      Num_Fijo: body.Num_Fijo,
      Num_Celular: body.Num_Celular,
      Estado: "Activo",
      Estado_ing: "Active",
      password: await bcrypt.hash(body.password, 8),
      Perfil: body.Perfil,
      Publicidad: body.Publicidad,
      Estado_provincia: body.Estado_provincia,
      Tenant_Id: body.Tenant_Id,
    };
    const us = await db.findUsCli(Table,usuario.Email);
    let u
    for (var count = 0; count < us.length; count++) {
      u = us[count].Id;
    }
    console.log(u)
    if (u > 0){
      res.redirect("/mue")
    }else{
    res.redirect("/us")
  }
  }

  async function actualizarCU(req, res) {
    const { body } = req;
    const usuario = {
      Id: body.Id,
      Nombre: body.Nombre,
      Apellido: body.Apellido,
      Email: body.Email,
      Num_Fijo: body.Num_Fijo,
      Num_Celular: body.Num_Celular,
      Estado: body.Estado,
      Estado_ing: body.Estado_ing,
      Perfil: body.Perfil,
      Publicidad: body.Publicidad,
    };
    const result = await db.actualizar(Table, usuario);
    res.redirect("/us");
  }

  async function actualizarPC(req, res) {
    const { body } = req;
    const usuario = {
      Id: body.Id,
      Nombre: body.Nombre,
      Apellido: body.Apellido,
      Email: body.Email,
      Num_Fijo: body.Num_Fijo,
      Num_Celular: body.Num_Celular,
      Publicidad: body.Publicidad,
      Estado_provincia: body.Estado_provincia
    };
    const result = await db.actualizar(Table, usuario);
    res.redirect("/iu");
  }

  async function actualizarUcP(req, res) {
    const { body } = req;
    const usuario = {
      Id: body.Id,
      password: await bcrypt.hash(body.password, 8),
    };
    const result = await db.actualizar(Table, usuario);
    res.redirect("/Tcli");
  }

  async function actualizarCcP(req, res) {
    const { body } = req;
    const usuario = {
      Id: body.Id,
      password: await bcrypt.hash(body.password, 8),
    };
    const result = await db.actualizar(Table, usuario);
    res.redirect("/us");
  }

  async function actualizarUc(req, res) {
    const { body } = req;
    const usuario = {
      Id: body.Id,
      Nombre: body.Nombre,
      Apellido: body.Apellido,
      Email: body.Email,
      Num_Fijo: body.Num_Fijo,
      Num_Celular: body.Num_Celular,
      Estado: body.Estado,
      Estado_ing: body.Estado_ing,
      Perfil: body.Perfil,
      Publicidad: body.Publicidad,
    };
    const result = await db.actualizar(Table, usuario);
    res.redirect("/Tcli");
  }
  async function actualizarUcP(req, res) {
    const { body } = req;
    const usuario = {
      Id: body.Id,
      password: await bcrypt.hash(body.password, 8),
    };
    const result = await db.actualizar(Table, usuario);
    res.redirect("/Tcli");
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregarCLi,
    del,
    auth,
    getAllP,
    actualizarUc,
    actualizarUcP,
    actualizarCcP,
    actualizarCU,
    actualizarPC
  };
};
