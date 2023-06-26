const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const conexion = require("../../../DB/dbreg");
const { promisify } = require("util");
const { error } = require("console");

exports.auth = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
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
      conexion.query(
        "SELECT * FROM usuarios WHERE username = ?",
        [username],
        async (error, result) => {
          if (
            result.length == 0 ||
            !(await bcrypt.compare(password, result[0].password))
          ) {
            res.render("login", {
              alert: true,
              alertTitle: "Advertencia",
              alertMessage: "Usuario o contraseña incorrectos",
              alertIcon: "info",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            const id = result[0].id;
            console.log(id);
            console.log(process.env.JWT_SECRETE);
            const token = jwt.sign({ Id: id }, process.env.JWT_SECRETE, {
              expiresIn: process.env.JWT_TIME_EXPIRES,
            });
            console.log("Token: " + token);
            const cookiesOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
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
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const deDecodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETE
      );
      conexion.query(
        "SELECT * FROM usuarios WHERE username = ?",
        [deDecodificada.id],
        (error, result) => {
          if (!result) {
            return next();
          }
          req.username = result[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
};
