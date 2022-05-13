import { createContext, useReducer } from 'react'

export const AppContext = createContext()

export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...state, headerTitle: action.payload }
        default:
            return state
    }
}

export const AppContextProvider = ({ children }) => {
    const [state, dispatchApp] = useReducer(AppReducer, {
        headerTitle: "Welcome"
    })

    return (
        <AppContext.Provider value={{ ...state, dispatchApp }}>
            {children}
        </AppContext.Provider>
    )
}