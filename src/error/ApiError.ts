export default class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
        super()
        this.status = status
        this.message = message
    }

    static badRequest(description: string, e?: unknown) {
        if (e) {
            return new ApiError(400, `${description}: ${e instanceof Error ? e.message : e}`) 
        } else {
            return new ApiError(400, description)
        }
    }

    static unauthorized(description: string, e?: unknown) {
        if (e) {
            return new ApiError(401, `${description}: ${e instanceof Error ? e.message : e}`) 
        } else {
            return new ApiError(401, description)
        }
    }

    static notFound(description: string, e?: unknown) {
        if (e) {
            return new ApiError(404, `${description}: ${e instanceof Error ? e.message : e}`) 
        } else {
            return new ApiError(404, description)
        }
    }

    static internalServerError(description: string, e?: unknown) {
        if (e) {
            return new ApiError(500, `${description}: ${e instanceof Error ? e.message : e}`) 
        } else {
            return new ApiError(500, description)
        }
    }
}