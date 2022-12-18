import { createContext } from "react";


export const AuthContext = createContext({ setHasToken: (a: boolean) => { }, setLoading: (a: boolean) => { } })
export const AdminContext = createContext({ branchId: '', setBranchId: (a: string) => { } })