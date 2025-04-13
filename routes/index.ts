import express from 'express';

const router= express.Router();

router.get('/', (req, res) => { 
    res.render('index', {
        title: 'Kasitips',
        texto: 'HOLA MUNDO :D',
        nombre: 'Danilo Antonio',
        apellido: 'Marin Lombano',
        cedula: '31.719.608',
        seccion: 4
    })
})

export default router;