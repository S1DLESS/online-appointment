import { Schema, model, Types } from 'mongoose'


interface IMaster {
    name: string
    position: string
    description: string
    avatar_url: string,
    branch_id: Types.ObjectId
    service_ids: Types.DocumentArray<Types.ObjectId>
    is_deleted: boolean
}

const masterSchema = new Schema<IMaster>({
    name: { type: String, required: true },
    position: { type: String, required: true },
    description: String,
    avatar_url: String,
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    service_ids: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],
    is_deleted: { type: Boolean, default: false, required: true }
})

export default model<IMaster>("Master", masterSchema)