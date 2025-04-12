//:D helpe me 

import express from 'express'
import clear from 'console-clear'
const app = express()
const puerto = 3000
clear(true)

app.get('/', (req, res) => { 
    console.log("Recibiendo peticion")

    res.send('Bienvenido a Kasitips :D')
})

app.listen(puerto, () =>{
    console.log(`server: http://localhost:${puerto}`)
})