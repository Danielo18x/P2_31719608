import  sqlite3  from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config() 



export class ContactsModel{
    private static async conectionDataBase(){
        return open({
            filename: "./database/Services.db",
            driver: sqlite3.Database
        })
    }

    static async guardadoContacto(contact: { nombre: string; correo: string; telefono: string; comentario: string; ip: string; fecha: string; pais: string }){
        const db = await this.conectionDataBase()
        await db.run("CREATE TABLE IF NOT EXISTS contacto(id INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT, Correo TEXT, Telefono TEXT, Mensaje TEXT, Ip TEXT, Fecha_Hora TEXT, Pais TEXT)")

        await db.run("INSERT INTO contacto(Nombre, Correo, Telefono, Mensaje, Ip, Fecha_Hora, Pais) VALUES(?, ?, ?, ?, ?, ?, ?)", 
            contact.nombre, contact.correo, contact.telefono, contact.comentario, contact.ip, contact.fecha, contact.pais
        )

        await db.close()
    }

    static async accesoContacto(){
        const db = await this.conectionDataBase();
        const contactos =  await db.all('SELECT id, Nombre, Correo, Telefono, Mensaje, Ip, Fecha_Hora, Pais FROM contacto')
        return contactos;
        await db.close()
    }

    static async user(){
        
        const db = await this.conectionDataBase()
        await db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")
        
        const username = process.env.USER
        const password = process.env.PASSWORD
        console.log("PASSWORD desde .env:", process.env.PASSWORD);

        if (!username || !password) {
            throw new Error("Las variables USER o PASSWORD no están definidas en el archivo .env");
        }

        const usuarioExistente = await db.get("SELECT * FROM users WHERE username = ?", [username]);

        if (usuarioExistente) {
            console.log("⚠️ El usuario ya existe, no se insertará nuevamente.");
            await db.close();
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.run("INSERT INTO users(username, password_hash) VALUES(?, ?)", 
            username, hashedPassword
        )

        await db.close();
    }

    

    static async getUserByUsername(username: string) {
        const db = await this.conectionDataBase();
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
        await db.close();
        return user;
    } //se agrego ahorita, no se si esta bueno





}