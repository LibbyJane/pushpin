import { useEffect, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import axios from "axios"
import { apiBaseURL } from '../api/config';


export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch, token } = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)

        const config = {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'authorization': `Bearer ${token}`
            }
        }

        try {
            axios.get(`${apiBaseURL}/logout`, config).then(() => {
                console.log('logged out');
                dispatch({ type: 'UNAUTHENTICATED' })

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

    return { logout, error, isPending }
}