import express from 'express';
import clear from 'console-clear';
import bodyParser from 'body-parser';
import * as dotenv from "dotenv";
const app = express();
dotenv.config() 
const puerto= process.env.PORT

clear(true);


import indexRouter from "./routes/index"
import formPagoRouter from "./routes/form_pago"
import adminContactRouter from "./routes/admin_contact"


 //importo index del proyecto
app.disable('x-powered-by')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(express.json());


app.use(express.static (__dirname + "/public")); 

app.set('view engine', 'ejs');  //invocacion de motor de plantillas
app.set('views', __dirname + '/views')
app.set('trust proxy', true);

app.use('/', indexRouter); //Ruta principal :D
app.use('/pago', formPagoRouter);
app.use('/admin', adminContactRouter);


app.use((_req, res, _next) => {
    res.status(404).send('La ruta no fue encontrada')//Cuando el user busca una ruta que no existe lo redirijira aqui
})

app.listen(puerto, () =>{
    console.log(`server: http://localhost:${puerto}`)
})

