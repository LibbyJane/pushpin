import { useEffect, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import axios from "axios"
import { apiBaseURL } from '../api/config';

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()


    const login = async (email, password) => {
        setError(null)
        setIsPending(true)

        try {
            axios.post(
                `${apiBaseURL}/login`,
                { email, password }).then((response) => {
                    console.log('response', response)
                    localStorage.setItem('ppTkn', response.data.tokenInfo.token)
                    localStorage.setItem('ppSessionExpiry', response.data.tokenInfo.expiresAt)
                    localStorage.setItem('ppUser', JSON.stringify(response.data.user))

                    const payload = {
                        user: response.data.user,
                        token: response.data.tokenInfo.token
                    }

                    dispatch({ type: 'AUTHENTICATED', payload })

                    if (!isCancelled) {
                        setIsPending(false)
                        setError(null)
                    }
                });

            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        }
        catch (err) {
            if (!isCancelled) {
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { login, isPending, error }
}