import { useEffect, useState, useRef } from "react"
import { useAuthContext } from './useAuthContext'
import axios from "axios"
import { apiBaseURL } from '../api/config';
import { set } from "date-fns";


export const useEndpoint = (endpoint, method, data, _query, _orderBy) => {
    console.log('useEndpoint', endpoint, method, data)
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, token } = useAuthContext()
    // if we don't use a ref --> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    const query = useRef(_query).current
    const orderBy = useRef(_orderBy).current

    const config = {
        headers: {},
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
                setDocuments(response.data)
                setIsLoading(false)
            } catch (error) {
                console.log("There was a problem.", error)
                setIsLoading(false)
                if (error.response && error.response.status && error.response.status === 403) {
                    dispatch({ type: 'UNAUTHENTICATED' })
                }
            }

            return () => {
                ourRequest.cancel()
            }
        }
    }, [endpoint, query, orderBy])

    return { documents, isLoading, error }
}