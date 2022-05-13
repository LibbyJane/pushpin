import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useAddNote } from '../../hooks/useAddNote'
// import { timestamp } from '../../firebase/config'

import Note from '../../components/Note'
import Error from '../../components/Error'
import Swatch from '../../components/forms/Swatch'

import './Create.css'


export default function Create() {
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
    const { documents } = useCollection('users')
    const [users, setUsers] = useState([])

    const [noteImage, setNoteImage] = useState(null)
    const [noteImageError, setNoteImageError] = useState(null)

    // const [expiryDate, setExpiryDate] = useState('')
    const [message, setMessage] = useState('')
    const [style, setStyle] = useState('stickynote')
    const [color, setColor] = useState('var(--white)')
    const [recipients, setRecipients] = useState([])
    const [formError, setFormError] = useState(null)
    const { addNote, error } = useAddNote()

    useEffect(() => {
        if (documents) {
            const usersList = documents.map(u => {

                return {
                    value: {
                        displayName: u.displayName,
                        imageURL: u.imageURL,
                        id: u.id
                    },
                    label: u.displayName
                }
            })

            setUsers(usersList)
        }
    }, [documents])

    const handleFileChange = (e) => {
        setNoteImage(null)
        let selected = e.target.files[0]

        if (!selected) {
            setNoteImageError('Please select a file')
            return
        }
        if (!selected.type.includes('image')) {
            setNoteImageError('Selected file must be an image')
            return
        }
        if (selected.size > 100000) {
            setNoteImageError('Image file size must be less than 100kb')
            return
        }

        setNoteImageError(null)
        console.log('selected', selected)

        selected.URL = URL.createObjectURL(selected)
        console.log('selected2', selected)

        setNoteImage(selected)
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

        const recipientsList = recipients.map(u => {
            return {
                id: u.value.id
            }
        })
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

        await addNote(note, noteImage)

        if (!error) {
            navigate('/')
        }
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
            <form className="card form-create" onSubmit={handleSubmit}>

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
                        <label htmlFor="noteImage">Note image</label>
                        <input
                            name="noteImage"
                            id="noteImage"
                            required
                            type="file"
                            onChange={handleFileChange}
                        />
                        {noteImageError && <Error message={noteImageError} />}
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
                <Select
                    className='react-select-container'
                    classNamePrefix="react-select"
                    onChange={(option) => setRecipients(option)}
                    options={users}
                    isMulti
                />

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
                <Note note={{ message, style, color, noteImage, "createdBy": user, }} />
            </aside>
        </div>

    )
}