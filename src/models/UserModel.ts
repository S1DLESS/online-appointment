import { Schema, model, Types } from 'mongoose'


interface IUser {
    name?: string
    email: string
    password: string
    is_activated?: boolean
    activation_link?: string
    company_id: Types.ObjectId
}

const userSchema = new Schema<IUser>({
    name: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    is_activated: {type: Boolean, default: false},
    activation_link: String,
    company_id: {type: Schema.Types.ObjectId, ref: "Company", required: true}
})

export default model<IUser>("User", userSchema)