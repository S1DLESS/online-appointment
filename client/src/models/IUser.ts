export interface IUser {
    _id: string
    name: string
    email: string
    password: string
    is_activated: boolean
    activation_link: string
    company_id: string
}