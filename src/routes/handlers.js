const express = require('express');
const router = express.Router();

//Enrutamiento vistas

router.get('/test', (req,res) => {
    res.render('login/test',{
        title: "Login",
        style: "test.css",
    });
});

module.exports = router;