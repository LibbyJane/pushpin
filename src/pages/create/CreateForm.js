import { useState, useEffect, createRef, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../hooks/useAuthContext'

import SelectUser from '../../components/forms/SelectUser'
import Swatch from '../../components/forms/Swatch'
import UploadImage from '../../components/forms/UploadImage'
import Note from '../../components/Note'
import Error from '../../components/Error'

export default function CreateForm({ id, noteDraft, handleFormSubmit, imageEndpoint, imageEndpointMethod, resetForm }) {
    // useEffect(() => {
    //     setPageTitle('Send a note')
    // })

    const styles = [
        { value: 'stickynote', label: 'Sticky Note' },
        { value: 'polaroid', label: 'Polaroid' },
        { value: 'postcard', label: 'Post Card' },
    ]

    const colors = [
        { value: 'var(--white)', label: 'White' },
        { value: 'var(--note-yellow)', label: 'Yellow' },
        { value: 'var(--note-pink)', label: 'Pink' },
        { value: 'var(--note-blue)', label: 'Blue' },
        { value: 'var(--note-green)', label: 'Green' }
    ]

    const navigate = useNavigate()
    const { user } = useAuthContext()
    const [note, setNote] = useState(null)
    const [imageURL, setImageURL] = useState(noteDraft && noteDraft.notePhoto ? noteDraft.notePhoto : null)

    // const [expiryDate, setExpiryDate] = useState('')
    const [message, setMessage] = useState(noteDraft && noteDraft.message ? noteDraft.message : '')
    const [style, setStyle] = useState(noteDraft && noteDraft.style ? noteDraft.style : 'stickynote')
    const [color, setColor] = useState(noteDraft && noteDraft.color ? noteDraft.color : 'var(--white)')
    const [recipients, setRecipients] = useState(noteDraft && noteDraft.recipientsList ? noteDraft.recipientsList : [])

    const [formError, setFormError] = useState(null)

    useEffect(() => {
        if (resetForm) {
            setMessage('')
            setRecipients([])
            setImageURL(null)

            console.log('message, recipients', message, recipients)
        }
    }, [resetForm])

    const handleFileUpdate = (image) => {
        console.log('file updated', image.URL)
        setImageURL(image.URL)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        // if (!style) {
        //     setFormError('Please select a note style.')
        //     return
        // }
        if (recipients.length < 1) {
            setFormError('Please assign the note to at least 1 user')
            return
        }

        const recipientsList = recipients.map(u => u.value.id)
        const createdBy = {
            displayName: user.displayName,
            imageURL: user.imageURL,
            id: user.uid
        }

        const note = {
            // name,
            message,
            recipientsList,
            createdBy,
            // expiryDate: timestamp.fromDate(new Date(expiryDate)),
            style: style,
            color: color
        }

        setNote(note)
        handleFormSubmit(note)
    }

    // // if using html select
    // const handleAssignUsers = function(field)  {
    //     const selectedValues = [...field.options]
    //         .filter(x => x.selected)
    //         .map(x => x.value);
    //     setRecipients(selectedValues);
    // }

    return (
        <div className='cols'>
            <form id={id} className="card form-create" onSubmit={handleSubmit}>
                <label>Style:</label>
                <ul className='checkable-list'>
                    {styles.map((s) => (
                        <li key={s.value}>
                            <label>
                                <input
                                    type="radio"
                                    name="noteStyle"
                                    value={s.value}
                                    checked={s.value === style ? true : false}
                                    onChange={(e) => setStyle(e.target.value)}
                                />
                                {s.label}
                            </label>
                        </li>
                    ))}
                </ul>

                {style !== 'stickynote' && (
                    <>
                        <UploadImage
                            fieldId="notePhoto"
                            labelText="Note image"
                            handleFileUpdate={handleFileUpdate}
                            endpoint={imageEndpoint}
                            method={imageEndpointMethod}
                            reset={resetForm}
                        />
                    </>
                )}

                <label>Color:</label>
                <ul className='checkable-list'>
                    {colors.map((c) => (
                        <li key={c.value}>
                            <Swatch value={c.value} label={c.label} handler={setColor} />
                        </li>
                    ))}
                </ul>

                <label>Write your message:</label>
                <textarea
                    required
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                ></textarea>

                {/* <label>Expiry date:</label>
        <input
            required
            type="date"
            onChange={(e) => setExpiryDate(e.target.value)}
            value={expiryDate}
        /> */}

                <label>Send to:</label>
                <SelectUser handler={setRecipients} reset={resetForm} />

                {/* <select
            multiple
            onChange={(e) => handleAssignUsers(e.target)}
        >
            {documents && documents.map(user => {
                return <option key={user.id} value={user.id}>{user.displayName}</option>
            })}
        </select> */}

                <fieldset className='form-actions'>
                    <button type="reset" className="btn" onClick={() => navigate('/')}>Cancel</button>
                    <button type="submit" className="btn">Add note</button>
                </fieldset>

                {formError && <Error message={formError} />}
            </form>
            <aside className='note-preview'>
                {style === 'postcard' && imageURL && <Note note={{ message, style, color, imageURL, "createdBy": user, variant: "preview" }} />}
                <Note note={{ message, style, color, imageURL, "createdBy": user, variant: "preview" }} />
            </aside>
        </div>
    )
}