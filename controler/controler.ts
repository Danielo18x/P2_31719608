import { Request, Response } from "express";
import { ContactsModel } from "../model/model";
import { check, validationResult } from 'express-validator';


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
        check('nombre').matches(/^[a-zA-ZÀ-ÿ\s]{1,40}$/).withMessage('El nombre es obligatorio'),
        check('correo').isEmail().withMessage('Debe ser un correo valido'),
        check('telefono').matches(/^0?4(12|24|14|16|26)-?\d{7}$/).withMessage('El numero de telefono no es valido'),
        check('comentario').notEmpty().withMessage('El mensaje no puede estar vacío')
    ];

    
    static async add(req: Request, res: Response): Promise<void> {
        try {
            //Validar datos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('index', { errores: errors.array(), datos: req.body });
            }

            const {nombre, correo, telefono, comentario} = req.body
            const ip = (req.ip || "desconocida").replace('::ffff:', '');
            const fecha = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const guardarDatos = {nombre, correo, telefono, comentario, ip, fecha}

            await ContactsModel.guardadoContacto(guardarDatos)
            
            res.render('mensaje_contacto');

        } catch (error) {
            res.status(500).send('Error al guardar el contacto');
            console.error('Error al guardar el contacto:', error);
        }
    }

    static async access(req: Request, res: Response){
        try {
            const contacts = await ContactsModel.accesoContacto();
            res.render('contacts', {contacts});
        } catch (error) {
            res.status(500).send('Error al obtener los contactos');
            console.error('Error al guardar el contacto:', error);
        }
    }

    static async pago(req: Request, res: Response){
        res.render('mensaje_pago')
    }
}