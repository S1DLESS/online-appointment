export const getToken = () => localStorage.getItem('auth')
export const getClientToken = () => localStorage.getItem('clientToken')

export const setToken = (token: string) => localStorage.setItem('auth', token)
export const setClientToken = (token: string) => localStorage.setItem('clientToken', token)

export const deleteToken = () => localStorage.removeItem('auth')
export const deleteClientToken = () => localStorage.removeItem('clientToken')


export type Data = FormData | Object

const initHeaders = (isFormData: boolean, branchId: string): HeadersInit => {
    const requestHeaders = new Headers()
    if (!isFormData) {
        requestHeaders.set('Content-Type', 'application/json')
    }
    requestHeaders.set('Authorization', `Bearer ${getToken()}`)
    requestHeaders.set('X-BranchId', branchId)
    return requestHeaders
}


class Request {

    async get(url: string, branchId = '') {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/${url}`, {
            headers: initHeaders(true, branchId)
        })
        return await response.json()
    }

    async post(url: string, data: Data, branchId: string = '') {
        const isFormData = data instanceof FormData
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/${url}`, {
            method: 'POST',
            headers: initHeaders(isFormData, branchId),
            body: isFormData ? data : JSON.stringify(data)
        })
        return await response.json()
    }

    async put(url: string, data: Data, branchId: string = '') {
        const isFormData = data instanceof FormData
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/${url}`, {
            method: 'PUT',
            headers: initHeaders(isFormData, branchId),
            body: isFormData ? data : JSON.stringify(data)
        })
        return await response.json()
    }

    async delete(url: string, branchId: string = '') {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/${url}`, {
            method: 'DELETE',
            headers: initHeaders(true, branchId)
        })
        return await response.json()
    }
}

export default new Request()