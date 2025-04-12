//:D helpe me 

import express from 'express'

const app = express()

const puerto = 3000

app.get('/', (req, res) => { 
    console.log("Recibiendo peticion")

    res.send('Hola ptos :D 2')
})

app.listen(puerto, () =>{
    console.log(`server: http://localhost:${puerto}`)
})