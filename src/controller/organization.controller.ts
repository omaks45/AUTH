import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response } from 'express';
import Organization, { OrganizationDocument } from '../models/organization.model';
import { hashPassword } from '../utils/password.utils';

// Interface representing the data required for organization signup
interface SignupData {
    organizationName: string;
    organizationEmailAddress: string;
    contactPersonName: string;
    contactPersonEmailAddress: string;
    password: string;
    confirmPassword: string;
}

// Function to validate signup data
const validateSignupData = (signupData: SignupData): void => {
    const { password, confirmPassword } = signupData;
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
};

// Function to handle organization signup
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const signupData: SignupData = req.body;

        // Validate input data
        validateSignupData(signupData);

        // Hash the password
        const hashedPassword = await hashPassword(signupData.password);

        // Create a new instance of the Organization model using the input data
        const newOrganization: OrganizationDocument = new Organization({
            ...signupData,
            password: hashedPassword // Save the hashed password
        });

        // Save the organization to the database
        await newOrganization.save();

        // Send success response
        res.status(201).json({ message: 'Organization signed up successfully' });
    } catch (error: any) {
        // Handle errors
        console.error('Error during organization signup:', error);
        res.status(400).json({ error: error.message });
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
                let user: OrganizationDocument | null = await Organization.findOne({ email });

                // If the user does not exist, create a new user in the database
                if (!user) {
                    user = await Organization.create({
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
        const user = await Organization.findById(id);
        done(null, user);
    } catch (error: any) {
        done(error, null);
    }
})

export default { signup };
