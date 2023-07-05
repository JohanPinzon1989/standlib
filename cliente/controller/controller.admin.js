function index(req,res){
    res.render('ESP/admin/index')
}

function destroy(req,res){
    const id= req.body.Id;
    req.getConnection((err,conn)=>{
    conn.query("DELETE FROM usuarios_standlib WHERE Id = ?",[id], (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log(results);
       return res.redirect("/lUser");
      }
    });
});
}
function edit(req,res){
    const data= req.body;
    console.log(data.Id)
    req.getConnection((err,conn)=>{
    conn.query("SELECT * FROM usuarios_standlib WHERE Id = ?",[data.Id], (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log(results);
       return res.render("ESP/admin/EditUserOrg",{results});
      }
    });
});
}
function update(req,res){
    const data= req.body;
    req.getConnection((err,conn)=>{
    conn.query("UPDATE usuarios_standlib SET ? WHERE Id = ?",[data,data.Id], (error, results) => {
        console.log(results);
      if (error) {
        throw error;
      } else {
        console.log(results);
       return res.redirect("/lUser");
      }
    });
});
}

module.exports ={
    index: index,
    destroy: destroy,
    edit: edit,
    update: update,
}