import { Link } from 'react-router-dom'
import Welcome from '../assets/images/welcome.svg'

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
                <li className="polaroid">
                    <Link to='/create' className="note is-polaroid">
                        {/* <div className="note is-polaroid" style={{ backgroundColor: `var(--note-yellow)` }} > */}
                        <header className="note-header">
                            <img className="note-pin" src="/static/media/drawing-pin.98ca32a2.webp" alt="Push Pin" />
                        </header>
                        <div className='note-image' style={{ backgroundImage: `url(${Welcome})` }}>
                            <img src={Welcome} alt="Welcome" />
                        </div>
                        <div className="note-message">
                            <h4>Hello!</h4>
                            <p>It looks like you don&rsquo;t have any notes to show here at the moment.</p>
                            <p>Would you like to <span className='btn is-text'>send one?</span></p>
                        </div>
                    </Link>
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
