require('dotenv').config()
const pg = require('pg');
pg.defaults.ssl = true;

const bodyParser = require('body-parser')
const express = require('express')
const moment = require('moment')
const morgan = require('morgan')
const request = require('request')
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
    let scoresRaw = await sequelize.query('SELECT DISTINCT ON (user_id) * FROM scores ORDER BY user_id, score DESC');
    let scores = scoresRaw[0].map(score => {
        return {
            name: score.name,
            score: score.score,
            user_id: score.user_id,
            timestamp : moment(score.createdAt).unix(),
        }
    })
    scores = scores.sort((score1, score2) => score2.score - score1.score )
    res.json(scores)
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

const wrap = fn => (...args) => fn(...args).catch(args[2])

// Delete this user's scores, hidden
app.delete('/scores/:user_id', async (req, res) => {
    let scores = await Score.findAll({ where: { user_id: req.params.user_id }})
    await Promise.all(scores.map(score => score.destroy()))
    res.sendStatus(201)
})

app.get('/team', wrap(async (req, res, next) => {
    let url = 'https://www.shopspring.com/team.json'
    request(url).on('error', next).pipe(res)
}))

app.listen(process.env.PORT)
