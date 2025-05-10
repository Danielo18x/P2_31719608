import express from 'express';

import {ContactsController} from "../controler/controler"

const router= express.Router();

router.get('/', ContactsController.get)

router.post('/contact',  ContactsController.validateData, ContactsController.add)
router.post('/payment', ContactsController.pago)

export default router;