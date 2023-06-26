const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const cookiesParse = require("cookie-parser");
const pais = require("./src/modulos/pais/rutas");
const usuarios = require("./src/modulos/usuarios/rutas");
const errors = require("./src/red/errors");

const app = express();

// Setar motor de plantillas
app.set("view engine", "ejs");

//Setear carpeta public para archivos externos
app.use(express.static("public/"));

//Procesar datos enviados desde formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Setear variables de entorno
dotenv.config({ path: ",/env/env" });

//Setear las cookies
//app.use(cookiesParse);

//Lammar al router
app.use("/", require("./routes/router"));
app.use("/api/pais", pais);
app.use("/api/usuarios", usuarios);
app.use("/api/auth", usuarios);
app.use(errors);

app.listen(4000, () => {
  console.log("Server up running in port: 4000");
});
