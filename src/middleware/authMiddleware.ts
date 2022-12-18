import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt.js'


export default function (req: Request, res: Response, next: NextFunction) {
    if (req.method === 'options') {
        next()
    }
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: "Не авторизован"})
        }
        const decoded = verifyJwt(token)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({message: "Не авторизован"})
    }
}