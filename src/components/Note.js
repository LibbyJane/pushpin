import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEndpoint } from '../hooks/useEndpoint'

import HeartToggle from './HeartToggle'
import Avatar from './Avatar'
import Reactions from './forms/Reactions'

import PushPin from '../assets/images/drawing-pin.webp'
import StampFrame from '../assets/images/stamp-postmark.svg'

import './Note.scss'

function Note({ note, toggleHeart, variant }) {
    const [endpoint, setEndpoint] = useState(null)
    const [data, setData] = useState(null)
    const { documents, error } = useEndpoint(endpoint, 'PATCH', data)

    const handleDeleteNote = async function (id) {
        console.log('delete note id', id)
        setData({ 'status': 'deleted' })
        setEndpoint(`note/update_status/${id}`)
        //app.patch('/note/update_status/:noteId' setImageEndpoint
    }

    useEffect(() => {
        if (documents) {
            console.log('documents?', documents)
        }
    }, [documents])

    return (
        <div
            className={`note is-${note.style}`}
            style={{ backgroundColor: `${note.color ? note.color : ''}` }}
            data-status={note.status} >
            <NoteInner />
        </div>
    )

    // if (note.id) {
    //     return (
    //         <Link to={`/notes/${note.id}`} className={`note is-${note.style}`} style={{ backgroundColor: `${note.color ? note.color : ''}` }} data-saved={note.saved} >
    //             <NoteInner note={note} toggleHeart={toggleHeart} />
    //         </Link>
    //     )
    // }
    // else {
    //     return (
    //         <div className={`note is-${note.style}`} style={{ backgroundColor: `${note.color ? note.color : ''}` }} data-saved={note.saved} >
    //             <NoteInner />
    //         </div>
    //     )
    // }

    function NoteInner() {
        return (
            <>
                <header className="note-header">
                    {note.id && toggleHeart &&
                        <HeartToggle
                            val={note.id}
                            isSet={note.saved}
                            callback={toggleHeart}
                        />
                    }

                    {note.id &&
                        <button
                            className="note-delete"
                            onClick={(e) => handleDeleteNote(note.id)}
                            type="button"
                        >
                            <img className="note-pin" src={PushPin} alt="Push Pin" />
                        </button>
                    }

                    {!note.id &&
                        <img className="note-pin" src={PushPin} alt="Push Pin" />
                    }

                    {note.id &&
                        <Reactions noteID={note.id} reaction={note.reaction} />
                    }
                </header>

                {
                    (note.imageURL && note.style !== 'stickynote') &&
                    <>
                        <div className='note-image' style={{ backgroundImage: `${note.imageURL ? 'url(' + note.imageURL + ')' : ''}` }}>
                            <img src={note.imageURL} alt="note image" />
                        </div>
                    </>
                }
                {note.style === 'postcard' && (
                    <div className='stamp-postmark'>
                        <img className='stamp-frame' src={StampFrame} alt="note image" />
                        <Avatar id={note.createdByID} />
                    </div>
                )}

                <ReactMarkdown
                    className='note-message formatted-text'
                    children={note.message}
                    remarkPlugins={[remarkGfm]}
                    allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]}
                />

                <footer className="note-footer">
                    <h6>From</h6>
                    <Avatar id={note.createdByID} showName={true} />
                    {/*  */}
                    {/* <p className='note-author'>from {note.createdBy.displayName}</p> */}
                </footer>
            </>
        )
    }
}




Note.propTypes = {
    id: PropTypes.string,
    saved: PropTypes.bool,
    toggleHeart: PropTypes.func,
    notePhoto: PropTypes.object,
    message: PropTypes.string,
    createdBy: PropTypes.string,
    delete: PropTypes.func
}

export default Note