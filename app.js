require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User')

const app = express();
//Config JSON Response
app.use(express.json())


const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

// Open Route Public
app.get('/', (req, res) => {
    res.status(200).json({message: "Bem vindo a nossa API!"})
})


// Router Private
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    //check user if exists
    const user = await User.findById(id, '-password');
    console.log(user, "aa")
    if(!user){

        return res.status(404).json({ msg : "Usuario não encontrado!"})
    } else {

        res.status(200).json({ user })
    }

})

function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({ msg: "Acesso negado!"})
    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()

    } catch(error){
        res.status(400).json({msg: "Token inválido"})
    }
}

//Register User
app.post('/auth/register', async(req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    //validations
    if(!name){
        return res.status(422).json({message: "O nome é obrigatório!"})
    }
    if(!email){
        return res.status(422).json({message: "O email é obrigatório!"})
    }
    if(!password){
        return res.status(422).json({message: "A senha é obrigatório!"})
    }
    if(!confirmPassword){
        return res.status(422).json({message: "A confirmação da senha é obrigatória!"})
    }

    if(password !== confirmPassword){
        return res.status(422).json({message: "As senhas não são iguais"})
    }

    //check if user exists

    const UserExist =  await User.findOne({ email: email})

    if(UserExist){
        return res.status(422).json({message: "Por favor, utilize outro email"})
    }
    console.log(UserExist, "aaa")

    //create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name, 
        email,
        password: passwordHash
    })

    try{
        await user.save()
        res.status(201).json({message: "Usuario criado com sucesso!"})

    } catch(error){
        console.log(error)
        res.status(500).json({message: "error"})
    }

})

// Router Login
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email){
        return res.status(422).json({ msg: 'O email é obrigatório'})
    }
    if(!password){
        return res.status(422).json({ msg: 'O senha é obrigatório'})
    }
    const user = await User.findOne({ email: email })

    if(!user){
            res.status(404).json({ mmsg: "Usuario não encontrado"})
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword){
        res.status(422).json({ msg: "Senha invalida"})
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user,

        }, 
            secret,
        )

        res.status(200).json({ msg: "Autenticação realizada com sucesso!", token})
    } catch {
       

        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
        })
    }

})



mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wkgoqrv.mongodb.net/?retryWrites=true&w=majority`)
        .then(() => {
            app.listen(3000)
            console.log("Connect with data base!")
        }).catch((err) => {
    

})