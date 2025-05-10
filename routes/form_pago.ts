import {Router} from 'express';

const router = Router();

router.get('/service', (req, res) => {
    res.render('form_pago', {
        title: 'ReparaTech Pago',
    })
});


export default router;