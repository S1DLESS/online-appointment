import 'dotenv/config'
import path from 'path'
import express, { Request, Response } from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './routes/index.js'
import errorHandler from './middleware/ErrorHandlingMiddleware.js'
import { fileURLToPath } from 'url'

const PORT = process.env.PORT || 5000

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '..', 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')))
    app.get('*', (req: Request, res: Response) => res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html')))
}

const start = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.DB_URI as string)
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
