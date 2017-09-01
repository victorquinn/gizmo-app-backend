require('dotenv').config()
const pg = require('pg');
pg.defaults.ssl = true;

const express = require('express')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB)

const User = sequelize.define('user', {
    name: Sequelize.STRING
})

const Score = sequelize.define('score', {
    score: Sequelize.INTEGER
})

Score.belongsTo(User)

sequelize.sync().then(() => {
    console.log("db successfully sync'd")
})

