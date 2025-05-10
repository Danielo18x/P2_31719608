import {Router} from 'express';
import {ContactsController} from '../controler/controler';

const router = Router();

router.get('/contacts', ContactsController.access);


export default router;