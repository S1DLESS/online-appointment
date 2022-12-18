import { NextFunction, Request, Response } from 'express'
import BranchModel from '../models/BranchModel.js'


export default async function (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
) {
    if (req.method === 'options') {
        next()
    }
    try {
        const branchId = (req.headers['x-branchid'] || '') as string
        if (branchId && branchId.match(/^[0-9a-fA-F]{24}$/)) {
            const branch = await BranchModel.findById(branchId)
            if (branch) {
                next()
            } else {
                res.status(404).json({message: "Филиал не найден"})
            }
        } else {
            res.status(400).json({message: "Неправильный ID филиала"})
        }
    } catch (e) {
        res.status(500).json({message: "Ошибка"})
    }
}