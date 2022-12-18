type DiscountType = '' | 'Скидка в день рождения' | 'Скидка за посещения'

export interface IService {
    _id: string
    title: string
    duration: number
    price: number
    description: string
    avatar_url: string
    branch_id: string
    master_ids: string[]
    is_deleted: boolean
    has_discount: boolean
    discount_type: DiscountType
    discount_price: number
}