import { useState, useEffect } from 'react'
// storage for the user's avatar, firestore to make a document for the user
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName, thumbnail) => {
        setError(null)
        setIsPending(true)

        try {
            // signup
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)

            if (!res) {
                throw new Error('Could not complete signup')
            }

            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
            const img = await projectStorage.ref(uploadPath).put(thumbnail)
            const imageURL = await img.ref.getDownloadURL()

            await res.user.updateProfile({ displayName, imageURL })

            // create a user document
            await projectFirestore.collection('users').doc(res.user.uid).set({
                online: true,
                displayName,
                email,
                imageURL,
                friends: []
            })

            dispatch({ type: 'LOGIN', payload: res.user })

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

    return { signup, error, isPending }
}