//se agrego ahorita
//import {Router} from 'express';
import express from "express";
import { Router } from "express"; //se agrego ahorita
import {ContactsController} from '../controler/controler';
import session from "express-session";
import { ContactsModel } from "../model/model";
import bcrypt from "bcrypt";


const router = Router();
router.use(express.json());

router.use(session({
    secret: "tu_secreto",
    resave: false,
    saveUninitialized: false
}));


declare module "express-session" {
    interface SessionData {
        userId?: number;
    }
}

(async () => {
    await ContactsModel.user();
})();



// Login de usuario
router.post("/login", async (req, res) => {
    const { user, password } = req.body;
    const usuario = await ContactsModel.getUserByUsername(user);

    if (!usuario){
        res.status(401).json({ error: "Usuario no encontrado" });
        
        //res.status(500).send('Usuario no encontrado');
    } 

    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match){
        res.status(401).json({ error: "Contraseña incorrecta" });
    }
    req.session.userId = usuario.id;
    res.json({ message: "Login exitoso" });
});
// Logout de usuario
router.post("/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Sesión cerrada" }));
});


router.get("/", ContactsController.adminGet);
export default router; //todo el archivo fue agregado recientemente


