import jwt from 'jsonwebtoken'


export interface IJwtPayload {
    id: string
    email: string
}

export const generateJwt = (id: string, email: string, expiresIn?: string): string => {
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        expiresIn ? {expiresIn} : undefined
    )
}

export const verifyJwt = (token: string) => {
    return jwt.verify(token, process.env.SECRET_KEY) as IJwtPayload
}