require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
})

app.get('/usuarios',async (req, res)=>{
    try{
        const response = await pool.query('SELECT * FROM usuarios;');
        res.json({
            data: response.rows
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Erro ao buscar usuários'})
    }
    
})

app.post('/usuarios', async (req, res)=>{
    const {nome, email, senha} = req.body;
    try{
        const response = await pool.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1,$2,$3) RETURNING *',[nome, email, senha]);
        res.json({
            message: 'Usuarios adicionado com sucesso',
            body:{
                usuario: response.rows[0]
            }
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Erro ao adicionar usuário'})
    }
})

module.exports = app;