import { useEffect, useState, useRef } from "react"
import { useAuthContext } from './useAuthContext'
import axios, { post } from "axios"
import { apiBaseURL } from '../api/config';

export const useMediaEndpoint = (endpoint, method, data) => {
    console.log('useMediaEndpoint', endpoint, method, data)
    const [outcome, setOutcome] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, token } = useAuthContext()


    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        },
        baseURL: apiBaseURL,
        url: endpoint
    }

    if (token) {
        config.headers.authorization = `Bearer ${token}`
    }

    if (method) {
        config.method = method;
    }

    if (data) {
        config.data = data;
    }

    useEffect(async () => {
        if (endpoint) {
            console.log('endpoint', endpoint)

            const ourRequest = axios.CancelToken.source()
            config.cancelToken = ourRequest.token;
            setIsLoading(true)

            try {
                const response = await axios(config)
                console.log(endpoint + ' response ' + response)
                setOutcome(response.data)
                setIsLoading(false)
            } catch (error) {
                console.log("There was a problem.", error)
                setError(error)
                setIsLoading(false)
                if (error.response && error.response.status && error.response.status === 403) {
                    dispatch({ type: 'UNAUTHENTICATED' })
                }
            }

            return () => {
                ourRequest.cancel()
            }
        }
    }, [endpoint, data])

    return { outcome, isLoading, error }
}