const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()
const userRoutes = require('./routes/userRoutes.js')
const petsRoutes = require('./routes/petsRoutes.js')

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/user', userRoutes)
app.use('/pets', petsRoutes)

app.use(errorMiddleware)

module.exports = app
