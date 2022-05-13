import { Link } from 'react-router-dom'
import { useFirestore } from "../hooks/useFirestore"
import Note from './Note'

import './NoteList.css'

export default function NoteList({ notes }) {
    const { updateDocument } = useFirestore('notes')

    const toggleHeart = async (id) => {
        notes.find((n, index) => {
            if (n.id === id) {
                const newVal = notes[index].saved ? !notes[index].saved : true
                updateDocument(id, {
                    saved: newVal
                })
                return true; // stop searching
            } else {
                return false
            }
        });
    }

    return (
        <ul className="list-notes">
            {notes.length === 0 &&
                <li className="card">
                    <h4>Welcome</h4>
                    <p>Looks like you don&rsquo;t have any notes at the moment. Would you like to <Link to='/create'>send one?</Link></p>
                </li>
            }
            {notes.map(note => (
                <li key={note.id} className={note.style}>
                    <Note note={note} toggleHeart={toggleHeart}  />
                </li>
            ))}
        </ul>
    )
}
