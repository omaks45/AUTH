import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response } from 'express';
import Individual, { UserDocument } from '../models/individual.model';
import { hashPassword } from '../utils/password.utils';
import { validationResult } from 'express-validator';

// Function to handle signup



export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        // Extract individual input from the request body
        const { firstName, lastName, email, phoneNumber, password }: UserDocument = req.body;

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new instance of the Individual model using the input data
        const newIndividual: UserDocument = new Individual({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword // The password is hashed
        });

        // Save the individual to the database
        await newIndividual.save();

        // Send success response
        res.status(201).json({ message: 'Individual signed up successfully' });
    } catch (error: any) {
        // Handle errors
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//use the google strategy with passport
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: '/api/google/home'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract the email and name from the Google profile
                const email = profile.emails ? profile.emails[0].value : '';
                const name = profile.displayName ? profile.displayName : '';

                // Check if the user already exists in the database
                let user: UserDocument | null = await Individual.findOne({ email });

                // If the user does not exist, create a new user in the database
                if (!user) {
                    user = await Individual.create({
                        email,
                        firstName: name
                    });
                }

                // Return the user
                return done(null, user);
            } catch (error: any) {
                // Handle errors
                console.error('Error during Google authentication:', error);
                return done(error);
            }
        }
    )
);

//serialize the individual
passport.serializeUser((user, done) => {
    done(null, user);
});

//deserialize the individual from the session
passport.deserializeUser(async(id, done) => {
    try {
        const user = await Individual.findById(id);
        done(null, user);
    } catch (error: any) {
        done(error, null);
    }
})

export default { signup };
