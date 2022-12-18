import { Schema, model } from 'mongoose'


interface ICompany {
    title: string
    description?: string
}

const companySchema = new Schema<ICompany>({
    title: {type: String, required: true},
    description: String,
})

export default model<ICompany>("Company", companySchema)