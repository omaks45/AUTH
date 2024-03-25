
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface representing the structure of the decoded token
interface DecodedToken {
  _id: string;
}

// Middleware function to authenticate user using JWT token
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  // Extract the JWT token from the request headers (assuming it's passed in the 'Authorization' header)
  const token = req.header('Authorization');

  // If no token is provided, respond with Unauthorized status
if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
}

try {
    // Verify the token using the secret key stored in environment variables
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error('Secret key is not defined');
    }
    if (!token) {
        throw new Error('Token is not provided');
    }
    const decoded = jwt.verify(token, secretKey) as DecodedToken;

    // Set the decoded user ID on the request object for future use
    req.user = { _id: decoded._id };

    // Move to the next middleware in the chain
    next();
} catch (error) {
    // If token verification fails or an error occurs, respond with Token is not valid status
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
}
};

