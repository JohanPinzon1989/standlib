const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");

const Table = "usuarios_standlib";

module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../../DB/database");
  }

  async function auth(Email, password) {
    console.log(Email, password);
    if (!Email || !password) {
      res.render("adlogin", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y contraseña",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "adlogin",
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
          res.render("adlogin", {
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

  async function agregar(body) {
    if (body.Id == "0") {
      const usuario = {
        Id: null,
        Nombre: body.Nombre,
        Apellido: body.Apellido,
        Email: body.Email,
        password: await bcrypt.hash(body.password, 8),
        Estado: "Activo",
        Rol: body.Rol,
      };
      const us = await db.findUsOrg(Table, usuario.Email);
      let UsOrg;
      for (var count = 0; count < us.length; count++) {
        UsOrg = us[count].Email;
      }
      if (UsOrg == usuario.Email) {
      } else {
        return db.agregar(Table, usuario);
      }
    } else {
      const usuario = {
        Id: body.Id,
        Nombre: body.Nombre,
        Apellido: body.Apellido,
        Email: body.Email,
        Estado: body.Estado,
        Rol: body.Rol,
      };
      return db.agregar(Table, usuario);
    }
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregar,
    del,
    auth,
    getAllP,
  };
};
