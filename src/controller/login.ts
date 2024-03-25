import { Request, Response } from 'express';
import Individual, { UserDocument } from '../models/individual.model';
import bcrypt from 'bcrypt';

// Extend the UserDocument interface to include the comparePassword method
interface UserDocumentWithMethods extends UserDocument {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Function to handle user login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: { email: string; password: string } = req.body;

        // Find the user by email
        const user: UserDocumentWithMethods | null = await Individual.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the provided password matches the hashed password in the database
        const isPasswordValid: boolean = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // If authentication is successful, generate a token or perform any other actions as needed

        res.status(200).json({ message: 'Login successful', user });
    } catch (error: any) {
        // Handle errors
        console.error('Error during login:', error);
        res.status(401).json({ error: error.message });
    }
};
