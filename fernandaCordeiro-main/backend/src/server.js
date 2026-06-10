require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rotasUsuarios = require('../routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', rotasUsuarios)

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`)
})