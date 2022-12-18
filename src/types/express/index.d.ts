import { IJwtPayload } from "../../utils/jwt.js";


declare global {
    namespace Express {
        export interface Request {
            user?: IJwtPayload,
        }
    }
}

export { }