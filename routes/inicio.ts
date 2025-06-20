import express from "express";
import { Router } from "express";
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
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        //secure: process.env.NODE_ENV === 'production', descomentar cuando trabaje con render
        secure: false,
        maxAge: 15 * 60 * 1000
    }
}));


//  Inicializar Passport
router.use(passport.initialize());
router.use(passport.session());

declare module "express-session" {
    interface SessionData {
        userId?: number;
        ultimaAccion?: number;
    }
}

router.use((req, res, next) => {
    const rutasExentas = ["/login", "/admin", "/auth/google", "/auth/google/callback"];

    if (rutasExentas.includes(req.path)) return next();

    const now = Date.now();
    const INACTIVITY_LIMIT = 15 * 60 * 1000;

    if (req.session.ultimaAccion && now - req.session.ultimaAccion > INACTIVITY_LIMIT) {
        req.session.destroy(() => res.redirect("/login"));
    } else {
        req.session.ultimaAccion = now;
        next();
    }
});

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
    req.session.destroy(() => res.json({ message: "Sesión cerrada" }));
    req.session.destroy(() => res.redirect("/login"));

});


// 🌐 Login con Google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/login/admin"
}));


router.get("/admin", (req, res) => {
    if (req.isAuthenticated() || req.session.userId) {
        res.render("panel_admin"); // o cualquier vista que tengas
    } else {
        res.redirect("/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});


router.get('/admin/contacts', ContactsController.access);
router.get('/admin/payments', ContactsController.accessPayment);



router.get("/", ContactsController.adminGet);


export default router; 


