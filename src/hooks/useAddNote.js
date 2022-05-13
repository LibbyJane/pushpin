import { useState, useEffect } from 'react'
// storage for the user's avatar, firestore to make a document for the user
import { projectAuth, projectStorage } from '../firebase/config'
import { useFirestore } from './useFirestore'
import { useAuthContext } from "../hooks/useAuthContext"



export const useAddNote = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { addDocument } = useFirestore('notes')
    const { user } = useAuthContext()
    const id = user.id

    const addNote = async (note, image) => {
        console.log('addnote', note, image)
        setError(null)
        setIsPending(true)

        try {
            if (image) {
                const uploadPath = `noteImages/${id}/${image.name}`
                const img = await projectStorage.ref(uploadPath).put(image)

                const noteImage = {
                    URL: await img.ref.getDownloadURL(),
                    name: image.name
                }

                note = { ...note, noteImage }
            }
            await addDocument(note)

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

    return { addNote, isPending, error }
}