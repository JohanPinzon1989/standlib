function login(req, res) {
    res.render('login/index');
}
function register(req, res) {
    res.render('login/register');
}

function storeUser(req, res){
    const data = req.body;
    console.log(data);
}

module.exports = {
    login,
    register,
    storeUser,
};