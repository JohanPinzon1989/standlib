const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const conexion = require("../../DB/dbreg");
const { promisify } = require("util");
const { error } = require("console");

exports.auth = async (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.password;

    if (!email || !password) {
      res.render("ESP/admin/login", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un correo y/o contraseña",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "adlogin",
      });
    } else {
     conexion.query(
        "SELECT * FROM usuarios_standlib WHERE Email = ?",
        [email],
        async (error, result) => {
          if (
            result.length == 0 ||
            !(await bcrypt.compare(password, result[0].Password))
          ) {
            res.render("ESP/admin/login", {
              alert: true,
              alertTitle: "Advertencia",
              alertMessage: "Correo o contraseña incorrectos",
              alertIcon: "info",
              showConfirmButton: true,
              timer: false,
              ruta: "adlogin",
            });
          } else {
            const id = result[0].id;
            const token = jwt.sign({ Id: id }, process.env.JWT_SECRETE, {
              expiresIn: process.env.JWT_TIME_EXPIRES,
            });
            console.log("Token: " + token);
            const cookiesOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
              ),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookiesOptions);
            res.render("ESP/admin/login", {
              alert: true,
              alertTitle: "Conexion exitosa",
              alertMessage: "DATOS CORRECTOS!",
              alertIcon: "success",
              showConfirmButton: true,
              timer: 800,
              ruta: "ia",
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
        "SELECT * FROM usuarios_standlib WHERE Email = ?",
        [deDecodificada.email],
        (error, result) => {
          if (!result) {
            return next();
          }
          req.Email = result[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("adlogin");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("adlogin");
};
