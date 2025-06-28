import {Router} from 'express';

import {ContactsController} from "../controler/controler"

const router = Router();
router.get('/servicio', ContactsController.getpago)
router.post('/payment', ContactsController.validate, ContactsController.processPayment)


export default router;