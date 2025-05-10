import  sqlite3  from "sqlite3";
import { open } from "sqlite";


export class ContactsModel{
    private static async conectionDataBase(){
        return open({
            filename: "./database/Services.db",
            driver: sqlite3.Database
        })
    }

    static async guardadoContacto(contact: { nombre: string; correo: string; telefono: string; comentario: string; ip: string; fecha: string }){
        const db = await this.conectionDataBase()
        await db.run("CREATE TABLE IF NOT EXISTS contacto(id INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT, Correo TEXT, Telefono TEXT, Mensaje TEXT, Ip TEXT, Fecha_Hora TEXT)")

        await db.run("INSERT INTO contacto(Nombre, Correo, Telefono, Mensaje, Ip, Fecha_Hora) VALUES(?, ?, ?, ?, ?, ?)", 
            contact.nombre, contact.correo, contact.telefono, contact.comentario, contact.ip, contact.fecha
        )

        await db.close()
    }

    static async accesoContacto(){
        const db = await this.conectionDataBase();
        const contactos =  await db.all('SELECT id, Nombre, Correo, Telefono, Mensaje, Ip, Fecha_Hora FROM contacto')
        return contactos;
        await db.close()
    }
}