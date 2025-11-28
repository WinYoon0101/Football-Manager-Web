import prisma from "../config/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-mac-dinh';
class AuthService {
    async register(email: string, password: string, name?: string) {
        // check if user is existing
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser){
            throw new Error('Email is existing.')
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10)
        // create new user
        const newUser = await prisma.user.create({
            data: {email, password: hashPassword, name}
        })

        return {id: newUser.id, email: newUser.email, name: newUser.name}
    }

    async login(email: string, password: string){
        const user = await prisma.user.findUnique({where: {email}})
        if (!user){
            throw new Error('Email or password is incorrect')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid){
            throw new Error('Email or password is incorrect')
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email},
            JWT_SECRET,
            { expiresIn: '1h'}
        )
        return {
            user: { id: user.id, email: user.email, name: user.name },
            token
        };
    }
}

export default new AuthService();   