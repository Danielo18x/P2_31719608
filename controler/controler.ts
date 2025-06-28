import { Request, Response } from "express";
import { ContactsModel } from "../model/model";
import { check, checkSchema, validationResult } from 'express-validator';
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import session from "express-session";
declare module "express-session" {
    interface SessionData {
        userId?: number;
        ultimaAccion?: number;
    }
}
export class ContactsController{
    

    static async get(req: Request, res: Response){
        //para validar
        try {
            res.render('index', { datos: {}, errores: [] });
        } catch (error) {
            res.status(500).send('Error al cargar la página');
            console.error('Error:', error);
        }
    }

    static validateData = [
        check('nombre').matches(/^[a-zA-ZÀ-ÿ\s]{1,40}$/).withMessage((value, { req }) => req.__('val_nombre')),
        check('correo').isEmail().withMessage((value, { req }) => req.__('val_correo')),
        check('telefono').matches(/^0?4(12|24|14|16|26)-?\d{7}$/).withMessage((value, { req }) => req.__('val_telefono')),
        check('comentario').notEmpty().withMessage((value, { req }) => req.__('val_comentario'))
    ];



    static async add(req: Request, res: Response): Promise<void> {
        try {
            //validar Recaptchap
            dotenv.config() 
            const captchaKeySecret = process.env.KEY_SECRET;
            const resUserCaptcha = req.body['g-recaptcha-response'];
            const captchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${captchaKeySecret}&response=${resUserCaptcha}`, {
                method: 'POST',
            });
            const captchaVerified = await captchaRes.json() as { success: boolean };

            if (!captchaVerified.success) {
                return res.status(400).render('index', {
                    errores: [{ msg: req.__('val_captcha') }],
                    datos: req.body
                });
            }

            //Validar datos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('index', { errores: errors.array(), datos: req.body });
            }

            const {nombre, correo, telefono, comentario} = req.body
            const ip = req.ip || '';

            //para localizar el pais de la ip
            let pais= '';
            try{
                const resUb= await fetch(`https://ipapi.co/${ip}/json/`);
                const datosUb= await resUb.json() as {country_name?: string};
                pais= datosUb.country_name || '';
            } catch (e){
                pais= '';
            }
            const fecha = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const guardarDatos = {nombre, correo, telefono, comentario, ip, fecha, pais}

            await ContactsModel.guardadoContacto(guardarDatos)
            
            res.render('mensaje_contacto');

            //Enviar correo
            dotenv.config();

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: /*"programacion2ais@yopmail.com",*/ "daniantoml.26@gmail.com",
                    subject: "Nueva solicitud recibida",
                    html: `
                        <h3>Detalles de la solicitud:</h3>
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Correo:</strong> ${correo}</p>
                        <p><strong>Comentario:</strong> ${comentario}</p>
                        <p><strong>Dirección IP:</strong> ${ip}</p>
                        <p><strong>País:</strong> ${pais}</p>
                        <p><strong>Fecha/Hora:</strong> ${fecha}</p>
                    `
                };
                    await transporter.sendMail(mailOptions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error al enviar el correo" });
            }

        } catch (error) {
            res.status(500).send('Error al guardar el contacto');
            console.error('Error al guardar el contacto:', error);
        }
    }

    static async access(req: Request, res: Response){
        try {
            if (req.isAuthenticated() || req.session.userId) {
                const contacts = await ContactsModel.accesoContacto();
                res.render('contacts', {contacts});
            } else {
                res.redirect("/login");
            }
            
        } catch (error) {
            res.status(500).send('Error al obtener los contactos');
            console.error('Error al guardar el contacto:', error);
        }
    }

    static async getpago(req: Request, res: Response){
        //para validar
        try {
            res.render('form_pago', { datos: {}, errores: [] });
        } catch (error) {
            res.status(500).send('Error al cargar la página');
            console.error('Error:', error);
        }
    }

    static validate = [
        //Validar datos del Formulario de pago
        check('correo').isEmail().withMessage((value, { req }) => req.__('val_correo')),
        /*check('numTarjeta').custom(value => {
            if (!/^\d{16}$/.test(value)) {
                throw new Error('Numero de tarjeta no valido');
            }
            return true;
        }),*/
        check('numTarjeta').custom((value, { req }) => {
            if (!/^\d{16}$/.test(value)) {
                throw new Error(req.__('val_numTarjeta'));
            }
            return true;
        }),

        check(['mesExp', 'yearExp', 'cvv']).custom((value, { req, path }) => {
            const reglas = {
                mesExp: /^\d{2}$/,
                yearExp: /^\d{4}$/,
                cvv: /^\d{3}$/
            }

            if (!reglas[path as keyof typeof reglas].test(value)) {
                throw new Error(req.__('val_datos'))
            }
            return true;
        }),


        check('nomTarjeta').matches(/^[a-zA-ZÀ-ÿ\s]{1,40}$/).withMessage((value, { req }) => req.__('val_pnombre')),
        check('monto').isFloat({ min: 1 }).withMessage((value, { req }) => req.__('val_monto')),
    ];
    


    static async processPayment(req: Request, res: Response) {
        try {
            //Validar datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('form_pago', { errores: errors.array(), datos: req.body });
            }


            let { numTarjeta,  mesExp, yearExp, cvv,  nomTarjeta, monto, moneda, servicio } = req.body;
            numTarjeta = String(numTarjeta).replace(/\s+/g, '');
            const description = 'service';
            const reference = '011';

            const response = await fetch('https://fakepayment.onrender.com/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMjZUMTg6NTk6MzcuNjAwWiIsImlhdCI6MTc0ODI4NTk3N30.zumxTWH0WUBgb87jvMob5XOO4dWHDoCXhPECImhLykw' },
                body: JSON.stringify({
                    amount: String(monto),
                    "card-number": numTarjeta,
                    cvv: String(cvv),
                    "expiration-month": mesExp,
                    "expiration-year": yearExp,
                    "full-name": nomTarjeta,
                    currency: String(moneda),
                    description,
                    reference
                }, null, 2)
            });

            //console.log('Status de respuesta:', response.status);
            const text = await response.text();
            //console.log('Respuesta de la API:', text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                return res.render('mensaje_pago_fallo', { title: "Pago", error: "La API de pago no respondió correctamente." });
            }
            const fecha = new Date().toISOString().replace('T', ' ').substring(0, 10);
            let status
            if(result.message){
                status = "Exitoso"
            } else{
                status = "Fallido"
            }
            const estado_pago = status;
            const guardarDato = {servicio, monto, moneda, fecha, estado_pago}
            await ContactsModel.guardarPago(guardarDato)

            if (result.success) {
                return res.render('mensaje_pago_exito', { title: "Pago Exitoso" });
            } else {
                return res.render('mensaje_pago_fallo', { title: "Pago", error: result.message });
            }
        } catch (error) {
            console.log('Error en el pago:', error);
            return res.render('mensaje_pago_fallo', { title: "Pago", error: "Error procesando el pago." });
        }
    }
    
    //acceder a los pagos
    static async accessPayment(req: Request, res: Response){

        try {
            if (req.isAuthenticated() || req.session.userId) {
                const payments = await ContactsModel.accesoPagos();
                res.render('payments', {payments});
            } else {
                res.redirect("/login");
            }
            
        } catch (error) {
            res.status(500).send('Error al obtener los contactos');
            console.error('Error al guardar el contacto:', error);
        }
    }


    
    static async adminGet(req: Request, res: Response){
        //para validar
        try {
            res.render('inicio', { datos: {}, errores: [] });
        } catch (error) {
            res.status(500).send('Error al cargar la página');
            console.error('Error:', error);
        }
    } 

}





