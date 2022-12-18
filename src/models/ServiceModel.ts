import { Schema, model, Types } from 'mongoose'


export interface IService {
    title: string
    duration: number
    price: number
    description: string
    avatar_url: string
    branch_id: Types.ObjectId
    master_ids: Types.DocumentArray<Types.ObjectId>
    is_deleted: boolean
}

const serviceSchema = new Schema<IService>({
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    description: String,
    avatar_url: String,
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    master_ids: [{ type: Schema.Types.ObjectId, ref: "Master", required: true }],
    is_deleted: { type: Boolean, default: false, required: true }
})

export default model<IService>("Service", serviceSchema)