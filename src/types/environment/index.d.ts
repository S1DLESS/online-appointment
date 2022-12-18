declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            SECRET_KEY: string
            DB_URI: string
            SMTP_HOST: string
            SMTP_PORT: number
            SMTP_USER: string
            SMTP_PASSWORD: string
            CLIENT_URL: string
            API_URL: string
        }
    }
}

export {}