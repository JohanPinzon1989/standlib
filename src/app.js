const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.set('port', 4000);

const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));
app.get('/', function(req, res){
    res.sendFile(__dirname + './main.hbs');
    });
app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});

app.get('/', (req,res) => {
    res.render('home');
});

app.use(myconnection(mysql,{
    host: 'localhost',
    user: 'root',
    password: 'Soporte_456*',
    port: 3306,
    database: 'db_STANDLIB'
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));