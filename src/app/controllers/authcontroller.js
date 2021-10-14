const express = require ('express');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const config = require ('../../config/config');
const crypto = require ('crypto');
const mailer = require ('../../modules/mailer')

const Usuario = require ('../models/user');
const db = require('../../database/db');

function generateToken(params = {}){
    return jwt.sign(params, config.secret, {
        expiresIn: 86400,
    });
}

const router = express.Router();

router.post('/register', async (req,res, next)=>{
    try{   
        const {nomeUsuario} = req.body;
        if (await Usuario.findOne(  {   where: { nomeUsuario }        }   )        )
        return res.status(400).send({error: 'User already exists!'});

        const user = await Usuario.create (req.body);

        user.password = undefined;
        
        return res.send({
            user,
            token: generateToken({id: user.id})});
    }   catch (err){
        return res.status(400).send({error: 'Registration failed!'});
    }
})

router.post ('/authenticate', async (req, res)=>{
    const {nomeUsuario, password} = req.body;

    const user = await Usuario.findOne({where:{nomeUsuario,password}})

    if(!user)
        return res.status(400).send({error: 'User not found!'});

    if(!await (password, user.password))
        return res.status(400).send({error: 'Invalid password!'});

    user.password = undefined;

    res.send({
        user,
        token: generateToken({id: user.id})});
});

router.post('/forgot_password', async (req, res)=>{
    const {email,CPF} = req.body;
    
    try{
        const user = await Usuario.findOne({where:{email, CPF}})

        if(!user)
            res.status(400).send({error:'Erro user not found'})
        
        const password = user.password;

        const message = {
            from: "cleverson212121@gmail.com",
            to: email,
            subject: "Forgot Password",
            text: `Your password is: ${password}`,
            };

        mailer.sendMail(message, function (err) {
            if (err)
                res.status(400).send({error: 'Cannot send forgot password email'})
        });

        return res.json({
            erro: false,
            mensagem: 'E-mail enviado com sucesso'
        });
    
    }catch(err){
        console.log(err);
        res.status(400).send({error: 'Erro on forgot password, try again'})
    }

    

});

router.post('/update', async (req, res, next) => {
    const {newCPF, newName, newEmail, newPassword, nomeUsuario,newNomeUsuario} = req.body

    user = Usuario.findOne({where: {nomeUsuario}})

    if (!user)
        res.status(400).send({error:'Erro user not found'})

    const CPF = user.CPF
    const name = user.name
    const password = user.password
    const email = user.email
    
    Usuario.sync()
    .then(() => Usuario.update({
        CPF : newCPF,
        name : newName, 
        email : newEmail, 
        password : newPassword,
        nomeUsuario : newNomeUsuario
    },
    {where: {nomeUsuario}}))
    .then(console.log)

    user.password = undefined

    res.send({
        user,
        token: generateToken({id: user.id})});

});

router.post('/list', async (req, res) =>{
    const user = await Usuario.findAll()
    user.password = undefined;
    res.send(user)
});

router.post('/delete', async (req,res)=>{
    const {nomeUsuario} = req.body
    const user = await Usuario.findOne({where: {nomeUsuario}})
    if(!user)
        res.status(400).send('Erro user not found!')
    
    Usuario.destroy({where: {nomeUsuario}})
    if (err)
        res.status(400).send('Erro user not deleted.')

    res.send('User deleted')

})

module.exports = app => app.use ('/auth', router);