require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
//Config JSON Response
app.use(express.json())

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

// Open Route Public
app.get('/', (req, res) => {
    res.status(200).json({message: "Bem vindo a nossa API!"})
})


//Register User
app.post('/auth/register', async(req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    //validations
    if(!name){
        return res.status(422).json({message: "O nome é obrigatório!"})
    }

})

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wkgoqrv.mongodb.net/?retryWrites=true&w=majority`)
        .then(() => {
            app.listen(3000)
            console.log("Connect with data base!")
        }).catch((err) => {
    

})