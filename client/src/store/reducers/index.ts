import { combineReducers, compose, createStore } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import adminReducer from "./adminReducer";
import clientReducer from "./clientReducer";
import customerReducer from "./customerReducer";


const rootReducer = combineReducers({
    client: clientReducer,
    admin: adminReducer,
    customer: customerReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export default createStore(rootReducer, compose(
//     (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// ))

// export default createStore(rootReducer, composeEnhancers())
const store = configureStore({
    reducer: {
        admin: adminReducer,
        client: clientReducer,
        customer: customerReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store