import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useEndpoint } from '../../hooks/useEndpoint'

import CreateForm from './CreateForm'

import './Create.css'



export default function Create() {
    const navigate = useNavigate()
    const [note, setNote] = useState(null)
    const [endpoint, setEndpoint] = useState(null)
    const [imageEndpoint, setImageEndpoint] = useState(null)
    const [imageEndpointMethod, setImageEndpointMethod] = useState()
    const { documents, error } = useEndpoint(endpoint, 'POST', note)

    const sessionStorage = window.sessionStorage;
    const noteDraft = sessionStorage.getItem('ppDraft') ? sessionStorage.getItem('ppDraft') : null;

    const createNote = (data) => {
        console.log('create note with', data)
        sessionStorage.setItem('ppDraft', data)
        setNote(data)
        setEndpoint('note')
    }

    useEffect(() => {
        console.log('note created', documents)
        if (documents) {
            const endpoint = `/upload/note_photo/${documents.note.id}`
            setImageEndpointMethod('PATCH')
            setImageEndpoint(endpoint);
            sessionStorage.removeItem('ppDraft');
        }
    }, [documents])



    if (error) {
        console.log('error', error)
    }

    return (
        <CreateForm
            noteDraft={noteDraft}
            handleFormSubmit={createNote}
            imageEndpoint={imageEndpoint}
            imageEndpointMethod={imageEndpointMethod}
        />
    )
}