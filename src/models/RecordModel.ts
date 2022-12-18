import { Schema, model, Types } from 'mongoose'


interface IRecord {
    customer_id: Types.ObjectId
    comment: string
    date: Date
    branch_id: Types.ObjectId
    master_id: Types.ObjectId
    service_id: Types.ObjectId
    is_service_discounted: boolean
    discount_percent: number
    discount_type: string
}

const recordSchema = new Schema<IRecord>({
    customer_id: {type: Schema.Types.ObjectId, ref: "Customer", required: true},
    comment: {type: String, default: ''},
    date: {type: Date, required: true},
    branch_id: {type: Schema.Types.ObjectId, ref: "Branch", required: true},
    master_id: {type: Schema.Types.ObjectId, ref: "Master", required: true},
    service_id: {type: Schema.Types.ObjectId, ref: "Service", required: true},
    is_service_discounted: {type: Boolean, default: false, required: true},
    discount_percent: {type: Number, default: 0},
    discount_type: {type: String, default: ''}
})

export default model<IRecord>("Record", recordSchema)