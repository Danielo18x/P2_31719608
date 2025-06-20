//se agrego ahorita
//import {Router} from 'express';
import express from "express";
import { Router } from "express"; //se agrego ahorita
import {ContactsController} from '../controler/controler';
import session from "express-session";
import { ContactsModel } from "../model/model";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";


const router = Router();
router.use(express.json());
router.use(express.static('public'));
dotenv.config() 
//  Configurar sesión
router.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
}));


//  Inicializar Passport
router.use(passport.initialize());
router.use(passport.session());

//  Estrategia de Google
/*passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!
    },
    async (_accessToken, _refreshToken, profile, done) => {
        const usuario = {
        id: profile.id,
        username: profile.displayName,
        email: profile.emails?.[0].value
        };
        return done(null, usuario);
    }
    ));*/

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!
    },
    async (_accessToken, _refreshToken, profile, done) => {
        const correoPermitido = "danianto2606@gmail.com";
        const email = profile.emails?.[0].value;

        if (email !== correoPermitido) {
            return done(null, false, { message: "Correo no autorizado" });
        }

        const usuario = {
        id: profile.id,
        username: profile.displayName,
        email
        };

        return done(null, usuario);
    }
));



interface User {
    id: string;
    nombre: string;
    email?: string; //no se si dejar esto
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: User, done) => {
    done(null, user);
});




declare module "express-session" {
    interface SessionData {
        userId?: number;
    }
}

(async () => {
    await ContactsModel.user();
})();



// Login de usuario
router.post("/admin", async (req, res) => {
    const { user, password } = req.body;
    const usuario = await ContactsModel.getUserByUsername(user);

    if (!usuario){
        //res.status(401).json({ error: "Usuario no encontrado" });
        return res.redirect("/login");
    } 

    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match){
        //res.status(401).json({ error: "Contraseña incorrecta" });
        return res.redirect("/login");
    }
    req.session.userId = usuario.id;
    //res.json({ message: "Login exitoso" });
    return res.redirect("/login/admin");


});
// Logout de usuario
router.post("/logout", (req, res) => {
    //req.session.destroy(() => res.json({ message: "Sesión cerrada" }));
    req.session.destroy(() => res.redirect("/login")); //hay que probar a ver que tal

});


// 🌐 Login con Google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/login/admin"
}));


/*router.get("/login", (req, res) => {
  res.render("inicio"); // Asegúrate de que 'inicio' es tu archivo .ejs
});*/

router.get("/admin", (req, res) => {
    if (req.isAuthenticated() || req.session.userId) {
        res.render("panel_admin"); // o cualquier vista que tengas
    } else {
        res.redirect("/login");
    }
});

/*router.get("/admin/contacts", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("contacts"); // o cualquier vista que tengas
    } else {
        res.redirect("/login");
    }
});*/

router.get('/admin/contacts', ContactsController.access);



router.get("/", ContactsController.adminGet);


export default router; //todo el archivo fue agregado recientemente


