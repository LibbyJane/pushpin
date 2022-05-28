import { createContext, useReducer } from 'react'
export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTHENTICATED':
            return { ...state, user: action.payload.user, token: action.payload.token, authIsReady: true }
        case 'UNAUTHENTICATED':
            clearStorage()
            return { ...state, user: null, token: null, authIsReady: true }
        case 'API':
            state.axiosInstance = action.payload.axiosInstance;
            return { ...state, axiosInstance: action.payload.axiosInstance }
        case 'USER-UPDATE': {
            console.log('update', action.payload)
            // return { ...state, user: action.payload.user }
        }
        case 'FRIENDS':
            return { ...state, friends: action.payload.friends }
        default:
            return state
    }
}

const clearStorage = () => {
    localStorage.removeItem('ppTkn')
    localStorage.removeItem('ppSessionExpiry')
    localStorage.removeItem('ppUser')
    sessionStorage.removeItem('ppFriends')
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: null,
        axiosInstance: null,
        authIsReady: null,
        friends: null
    })


    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}