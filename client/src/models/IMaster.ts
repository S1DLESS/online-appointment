export interface IMaster {
    _id: string
    name: string
    position: string
    description: string
    avatar_url: string
    branch_id: string
    service_ids: string[]
    is_deleted: boolean
}