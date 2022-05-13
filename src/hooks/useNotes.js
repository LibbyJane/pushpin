import { useEffect, useState, useRef } from "react"

import axios from "axios";
import { apiBaseURL } from '../api/config';
import { useAuthContext } from "../hooks/useAuthContext"

export const useNotes = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { user } = useAuthContext()
    const id = user.id;
    const [documents, setDocuments] = useState(null)

    // if we don't use a ref --> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    // const query = useRef(_query).current
    // const orderBy = useRef(_orderBy).current

    useEffect(() => {
        setError(null)
        setIsPending(true)

        try {
            axios.post(`${apiBaseURL}notes`, { id }).then((response) => {
                setDocuments(response.data)

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


        return () => setIsCancelled(true)
    }, [])

    return { documents, isPending, error }
}