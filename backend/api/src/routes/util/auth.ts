import { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

// Load configs
dotenv.config();
const { TOKEN_SECRET } = process.env;

export function verifyAuthToken(request: Request, response: Response, next: NextFunction): void  {
    try {
        const authorizationHeader = request.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            jwt.verify(token, TOKEN_SECRET as string);
        } else  {
            throw Error('Missing Token, it is reuired in your request');
        }

        next()
    } catch (error) {
        response
        .status(401)
        .send(`${(error as Error).message}`);
    }
}