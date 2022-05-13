import { useNavigate } from 'react-router-dom'
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import Note from '../../components/Note'
import Avatar from "../../components/Avatar"

export default function NoteDetail({ note, id }) {
    const { deleteDocument } = useFirestore('notes')
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const handleClick = () => {
        deleteDocument(id)

        //TODO: delete any note images also
        navigate('/')
    }

    return (
        <div className="card note-detail">
            {note.noteImage && <img className='note-image' src={note.noteImage.URL} alt={note.noteImage.name} />}
            <p>{note.message}</p>
            <Avatar src={note.createdBy.imageURL} name={note.createdBy.displayName} />
            <p>from {note.createdBy.displayName} on {note.createdAt.toDate().toDateString()}</p>

            {user.uid === note.createdBy.id && (
                <button className="btn" onClick={handleClick}>Delete</button>
            )}
        </div>
    )
}
