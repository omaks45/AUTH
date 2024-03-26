import express from 'express';
import {signup} from '../controller/individual.controller';
import {register} from '../controller/organization.controller';
import {login} from '../controller/login'
import {authenticateUser} from '../middleware/authenticateUser';
import { check, validationResult } from 'express-validator';

const router = express.Router();

const isValidPhoneNumber = (value: string): { valid: boolean; error?: string } => {
    // Use a regular expression to match any sequence of digits with a minimum length of 10
    const phoneNumberRegex = /^\d{10,}$/;
    if (!phoneNumberRegex.test(value)) {
        return { valid: false, error: 'Phone number should contain at least 10 digits' };
    }
    return { valid: true };
};



router.post('/signup', [
    check("firstName", "First name should be at least 3 characters").isLength({ min: 3 }),
    check("lastName", "Last name should be at least 3 characters").isLength({ min: 3 }),
    check("email", "Email should be valid").isEmail(),
    check("phoneNumber", "Phone number should be valid").custom((value) => {
        return isValidPhoneNumber(value)
    }),
    check("password", "Password should be at least 6 characters").isLength({ min: 6 }),
    check("confirmPassword", "Passwords do not match").custom((value, { req }) => value === req.body.password),
], signup);

router.post('/register', register);

router.post('/login', authenticateUser, login)


export default router;