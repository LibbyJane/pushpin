import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

import { useEndpoint } from '../../hooks/useEndpoint'
import { useAuthContext } from '../../hooks/useAuthContext'
// import { useAddNote } from '../../hooks/useAddNote'
// import { timestamp } from '../../firebase/config'

import SelectUser from '../../components/forms/SelectUser'
import Swatch from '../../components/forms/Swatch'
import Note from '../../components/Note'
import CreateForm from './CreateForm'
import Error from '../../components/Error'

import './Create.css'
import UploadImage from '../../components/forms/UploadImage'


export default function Create() {
    const navigate = useNavigate()
    const [note, setNote] = useState(null)
    const [imageName, setImageName] = useState(null)
    const [endpoint, setEndpoint] = useState(null)
    const { documents, error } = useEndpoint(endpoint, 'POST', note)

    const sessionStorage = window.sessionStorage;
    const noteDraft = sessionStorage.getItem('ppDraft') ? sessionStorage.getItem('ppDraft') : null;

    const createNote = (data) => {
        console.log('create note with', data)
        sessionStorage.setItem('ppDraft', data)
        setNote(data)
        setEndpoint('note')
    }

    if (documents && imageName) {
        console.log('upload image')
        // UploadImage()
        // setUploadImageEndpoint(`/upload/note_photo/:${documents.note.id}`);
        // sessionStorage.removeItem('ppDraft');
    }

    if (error) {
        console.log('error', error)
    }

    return (
        <CreateForm
            noteDraft={noteDraft}
            handleFormSubmit={createNote}
            setImageName={setImageName}
        // uploadImageEndpoint={uploadImageEndpoint}
        // uploadImageMethod='PATCH'
        // uploadImageResponse={uploadImageResponse}
        />
    )
}