export interface IRecord {
    _id: string

    name: string
    phone: string
    email: string

    customer_id: string
    comment: string
    date: Date
    branch_id: string
    master_id: string
    service_id: string
    is_service_discounted: boolean
    discount_percent: number
    discount_type: string
}