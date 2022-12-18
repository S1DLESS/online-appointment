import { Schema, model, Types } from "mongoose"


interface IAuthCodes {
    code: string
    creation_date: Date
}

interface ICustomer {
    name: Types.Array<string>
    phone: number
    email: Types.Array<string>
    password: string
    birthdate: Date
    auth_codes: Types.DocumentArray<IAuthCodes>
}

const customerSchema = new Schema<ICustomer>({
    name: [{ type: String, required: true }],
    phone: { type: Number, required: true, unique: true },
    email: [String],
    password: { type: String, default: "" },
    birthdate: { type: Date, default: new Date(0) },
    auth_codes: [{
        code: { type: String, required: true },
        creation_date: { type: Date, required: true }
    }]
})

export default model<ICustomer>("Customer", customerSchema)