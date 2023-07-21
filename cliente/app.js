const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const cookiesParse = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { mysql } = require("./config");
const myconnection = require("express-myconnection");
const mysql2 = require("mysql2");
const routers = require("./routes/router");
const { expressCspHeader, INLINE, NONE, SELF } = require("express-csp-header");

const app = express();

//Setear carpeta public para archivos externos
app.use(express.static("public/"));
app.use(
  expressCspHeader({
    policies: {
      "default-src": [expressCspHeader.NONE],
      "img-src": [expressCspHeader.SELF],
    },
  })
);

// Setar motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Procesar datos enviados desde formularios
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

//Setear variables de entorno
dotenv.config();

//Setear las cookies
app.use(cookiesParse());

app.use(
  myconnection(
    mysql2,
    {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASS,
      database: process.env.DATABASE,
      port: 3306,
      insecureAuth: true,
    },
    "single"
  )
);

//Lammar al router
app.use("/", routers);

const port = process.env.PORT_SER;

app.listen(port || 4000, () => {
  console.log("Server up running: " + port);
});
