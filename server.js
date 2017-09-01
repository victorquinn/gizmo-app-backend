require('dotenv').config()
const pg = require('pg');
pg.defaults.ssl = true;

const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const Sequelize = require('sequelize')

// Set up models and db
const sequelize = new Sequelize(process.env.DATABASE_URL)

const Score = sequelize.define('score', {
    name: Sequelize.STRING,
    score: Sequelize.INTEGER,
    user_id: Sequelize.STRING,
})

sequelize.sync().then(() => {
    console.log("db successfully sync'd")
})

// Set up app
const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))

// Get all scores
app.get('/scores', async (req, res) => {
    let scores = await sequelize.query('SELECT DISTINCT ON (user_id) * FROM scores ORDER BY user_id, score DESC');
    console.log(scores[0])
    res.json(scores[0].map(score => {
        return {
            name: score.name,
            score: score.score,
            user_id: score.user_id,
            created_at: score.createdAt,
        }
    }))
})

// Create a new score for this user
app.post('/scores/:user_id', async (req, res) => {
    await Score.create({
        name: req.body.name,
        user_id: req.params.user_id,
        score: req.body.score,
    })

    res.sendStatus(201)
})

// Delete this user's scores, hidden
app.delete('/scores/:user_id', async (req, res) => {
    res.sendStatus(201)
})

app.listen(process.env.PORT)
