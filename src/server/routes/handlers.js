const express = require('express');
const router = express.Router();
const handlersController = require('../controllers/handlersController');


//Crar, buscar, actualizar eliminar
router.get('/', handlersController.view);
router.post('/', handlersController.find);

//Enrutamiento vistas
router.get('/test', (req,res) => {
    res.render('login/test',{
        title: "Login",
        style: "test.css",
    });
});

module.exports = router;