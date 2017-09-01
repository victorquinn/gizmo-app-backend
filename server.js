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
    user_id: Sequelize.STRING,
})

const AllScores = sequelize.define('all_scores', {
    name: Sequelize.STRING,
    score: Sequelize.INTEGER,
    user_id: Sequelize.STRING,
})

sequelize.sync().then(() => {
    console.log("db successfully sync'd")
})

// Set up app
const app = express()

// Get all scores
app.get('/scores', (req, res) => {
    res.json([{
        userId: 1,
        score: 230,
        createdAt: '2017-09-01 12:59',
    }])
})

// Create a new score for this user
app.post('/scores/:user_id', async (req, res) => {
    
    res.send(201)
})

// Delete this user's scores, hidden
app.delete('/scores/:user_id', async (req, res) => {
    res.send(201)
})

app.listen(process.env.PORT)
