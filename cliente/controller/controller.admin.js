function index(req,res){
    res.render('ESP/admin/index')
}

function destroy(req,res){
    const id= req.body.Id;
    /*conexion.query("DELETE FROM usuarios_standlib WHERE Id = ?",[id], (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log(results);
        res.redirect("/lUser", { alert: false });
      }
    });*/
    console.log(id)
}

module.exports ={
    index: index,
    destroy: destroy,
}