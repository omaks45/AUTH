import express from 'express';
import {signup} from '../controller/individual.controller';
import {register} from '../controller/organization.controller';
import {login} from '../controller/login'
import {authenticateUser} from '../middleware/authenticateUser';

const router = express.Router();

router.post('/signup', signup);

router.post('/register', register);

router.post('/login', authenticateUser, login)


export default router;