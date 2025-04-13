//:D helpe me 

import express from 'express';
import clear from 'console-clear';
const app = express(); 
const puerto = 3000;
clear(true);

import indexRouter from "./routes/index" //importo index del proyecto

app.set('view engine', 'ejs');  //invocacion de motor de plantillas
app.set('views', __dirname + '/views') //igual, permite utilizar ejs

app.use('/', indexRouter); //Ruta principal :D

app.use(express.static (__dirname + "/public"));  //Hace algo

app.use((_req, res, _next) => {
    res.status(404)//Cuando el user busca una ruta que no existe lo redirijira aqui
})

app.listen(puerto, () =>{
    console.log(`server: http://localhost:${puerto}`)
})


