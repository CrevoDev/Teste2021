const db = require('../../database/db');
const bcrypt = require ('bcryptjs');

const Usuario = db.sequelize.define('usuarios', {
    CPF: {
        type: db.Sequelize.BIGINT,
        allowNull: false,
        unique: true
    },
    name:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false,
        isLowercase: true,
        unique: true
    },
    nomeUsuario:{
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.NOW
    }
});

//Usuario.sync({force: true})

module.exports = Usuario;