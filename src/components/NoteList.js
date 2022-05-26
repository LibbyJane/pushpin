import { Link } from 'react-router-dom'
// import { useFirestore } from "../hooks/useFirestore"
import Note from './Note'

import './NoteList.scss'

export default function NoteList({ notes }) {
    console.log(notes)

    const toggleHeart = async (id) => {
        console.log('todo: save image')
        // notes.find((n, index) => {
        //     if (n.id === id) {
        //         const newVal = notes[index].saved ? !notes[index].saved : true
        //         updateDocument(id, {
        //             saved: newVal
        //         })
        //         return true; // stop searching
        //     } else {
        //         return false
        //     }
        // });
    }

    return (
        <ul className="list-notes">
            {notes.length === 0 &&
                <li className="stickynote">
                    <div className="note is-stickynote" style={{ backgroundColor: `var(--note-yellow)` }} >
                        <header className="note-header">
                            <img className="note-pin" src="/static/media/drawing-pin.98ca32a2.webp" alt="Push Pin" />
                        </header>
                        <div className="note-message">
                            <h4>Hello!</h4>
                            <p>It looks like you don&rsquo;t have any notes to show here at the moment.</p>
                            <p>Would you like to <Link to='/create'>send one?</Link></p>
                        </div>

                    </div>
                </li>
            }
            {
                notes.map(note => (
                    <li key={note.id} className={note.style}>
                        <Note note={note} toggleHeart={toggleHeart} />
                    </li>
                ))
            }
        </ul >
    )
}
