import { useState, useEffect } from "react"

export const useFetch = (url, method = "GET", requestData) => {
    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)
    const [options, setOptions] = useState(null)

    setOptions({
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: requestData ? JSON.stringify(requestData) : ''
    })

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async (fetchOptions) => {
            // console.log('fetchData', fetchData, fetchOptions)
            setIsPending(true)

            try {
                const res = await fetch(url, { ...fetchOptions, signal: controller.signal })
                if (!res.ok) {
                    throw new Error(res.statusText)
                }
                const d = await res.json()
                // console.log('data', data)
                setIsPending(false)
                setData(d)
                setError(null)
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("the fetch was aborted")
                } else {
                    setIsPending(false)
                    setError('Could not fetch the data')
                }
            }
        }

        switch (method.toLowerCase()) {
            case ('post'):
                if (options) {
                    fetchData(options)
                }
                break
            default:
                fetchData()
        }

        return () => {
            controller.abort()
        }

    }, [url, method, options])

    return { data, isPending, error }
}