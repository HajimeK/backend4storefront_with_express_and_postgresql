import { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

// Load configs
dotenv.config();
const { TOKEN_SECRET } = process.env;

export function verifyAuthToken(request: Request, response: Response, next: NextFunction)  {
    try {
        const authorizationHeader = request.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
        } else  {
            throw Error('Missing Token, where reuired');
        }

        next()
    } catch (error) {
        response
        .status(401)
        .send(`${error}`);
    }
}