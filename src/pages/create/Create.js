import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from "../../hooks/useAppContext"
import { useEndpoint } from '../../hooks/useEndpoint'

import Error from "../../components/Error"
import Alert from "../../components/Alert"
import Button from "../../components/Button"
import CreateForm from './CreateForm'

import './Create.scss'


export default function Create() {
    const { dispatchApp } = useAppContext()

    useEffect(() => {
        dispatchApp({ type: 'SET_TITLE', payload: 'Send a note' })
    }, [dispatchApp])

    const [showAlert, setShowAlert] = useState(false)
    const [resetForm, setResetForm] = useState(false)

    const [endpoint, setEndpoint] = useState(null)
    const [note, setNote] = useState(null)
    const { documents, error } = useEndpoint(endpoint, 'POST', note)

    const [imageEndpoint, setImageEndpoint] = useState(null)
    const [imageEndpointMethod, setImageEndpointMethod] = useState()

    const sessionStorage = window.sessionStorage;
    const noteDraft = sessionStorage.getItem('ppDraft') ? sessionStorage.getItem('ppDraft') : null;

    const createNote = (data) => {
        sessionStorage.setItem('ppDraft', data)
        setNote(data)
        setEndpoint('note')
    }

    const resetPage = () => {
        sessionStorage.removeItem('ppDraft')
        setNote(null)
        setEndpoint(null)
        setImageEndpoint(null)
        setResetForm(true)

        setTimeout(() => {
            setResetForm(false)
        }, 200);
    }

    useEffect(() => {
        if (documents) {
            const endpoint = `/upload/note_photo/${documents.note.id}`
            setImageEndpointMethod('PATCH')
            setImageEndpoint(endpoint);
            resetPage();
            setShowAlert(true);
        }
    }, [documents])

    return (
        <>
            {/* <Button variant="highlighted" onClick={() => resetPage()}>test</Button> */}
            <Alert variant="success" visible={showAlert} setVisible={setShowAlert}>
                <p>Your note has been sent! Would you like to <Button variant="highlighted" onClick={() => setShowAlert(false)}>send another</Button> or <Link to={`/`} className="is-highlighted">go back to your board</Link>?</p>
            </Alert>

            <CreateForm
                noteDraft={noteDraft}
                handleFormSubmit={createNote}
                imageEndpoint={imageEndpoint}
                imageEndpointMethod={imageEndpointMethod}
                resetForm={resetForm}
                id="createForm"
            />
            {
                error && (
                    <Error message={error} />
                )
            }
        </>
    )
}