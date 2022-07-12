require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

app.get('/', (req, res) => {
    res.status(200).json({message: "Bem vindo a nossa API!"})
})

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wkgoqrv.mongodb.net/?retryWrites=true&w=majority`).then().catch((err) => {
    app.listen(3000)
    console.log("Connect with data base!")

}).catch((err) => console.log(err))