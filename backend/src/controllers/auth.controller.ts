import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

class AuthController {
    register = async (req: Request, res: Response) => {
        try {
            const { email, password, name } = req.body;
            const user = await AuthService.register(email, password, name);
            res.status(201).json(user);
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ 
                message: (error as Error).message,
                error: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,

            });
        }
    }
    login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json(result);   
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                message: (error as Error).message,
                error: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
            });
        }
    }
}

export default new AuthController();