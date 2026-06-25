const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()
const userRoutes = require('./routes/userRoutes.js')
const petRoutes = require('./routes/petRoutes.js')
const adoptionRoutes = require('./routes/adoptionRoutes.js')

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use(userRoutes)
app.use(petRoutes)
app.use(adoptionRoutes)

app.use(errorMiddleware)

module.exports = app
