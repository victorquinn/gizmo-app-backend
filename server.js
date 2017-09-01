require('dotenv').config()
const pg = require('pg');
pg.defaults.ssl = true;

const express = require('express')
const Sequelize = require('sequelize')

// Set up models and db
const sequelize = new Sequelize(process.env.DATABASE_URL)

const Score = sequelize.define('score', {
    name: Sequelize.STRING,
    score: Sequelize.INTEGER,
})

sequelize.sync().then(() => {
    console.log("db successfully sync'd")
})

// Set up app
const app = express()

app.get('/scores', (req, res) => {
    res.json([{
        userId: 1,
        score: 230,
        createdAt: '2017-09-01 12:59',
    }])
})

app.listen(process.env.PORT)
