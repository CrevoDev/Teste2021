const Sequelize = require('sequelize');
const sequelize = new Sequelize ('Usuarios', 'root', '', {
    host:"localhost",
    dialect: 'mysql'
})

sequelize.authenticate().then(function(){
    console.log("conetado com sucesso!")
}).catch(function(erro){
    console.log("falha ao conectar." +erro)
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};