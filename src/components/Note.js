import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import HeartToggle from './HeartToggle'
import Avatar from './Avatar'

import PushPin from '../assets/images/drawing-pin.webp'
import './Note.scss'

function Note({ note, toggleHeart}) {
    return (
        <Link to={`/notes/${note.id}`} className={`note is-${note.style}`} data-saved={note.saved}  style={{ backgroundColor: `${note.color ? note.color : ''}` }}>
            <header className="note-header">
                { toggleHeart &&
                    <HeartToggle
                        val={note.id}
                        isSet={note.saved}
                        callback={toggleHeart}
                    />
                }

                <img className="note-pin" src={PushPin} alt="Push Pin" />
            </header>

            { note.noteImage &&
                <img className='note-image' src={ note.noteImage.URL} alt={ note.noteImage.name}/>
            }

            <ReactMarkdown
                className='note-message formatted-text'
                children={note.message}
                remarkPlugins={[remarkGfm]}
                allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]}
            />

            <footer className="note-footer">
                <Avatar src={note.createdBy.photoURL} name={note.createdBy.displayName} />
                <p className='note-author'>from {note.createdBy.displayName}</p>
            </footer>


            {/* <h4>{name}</h4>
            <p>Due by {dueDate.toDate().toDateString()}</p>
            <div className="assigned-to">
                <p><strong>Assigned to:</strong></p>
                <ul className="list-avatars">
                    {assignedUsersList.map(user => (
                        <li key={user.id}>
                            <Avatar src={user.photoURL} />
                        </li>
                    ))}
                </ul>
            </div> */}

</Link>
    )
}

Note.defaultProps = {
    reverse: false,
}

Note.propTypes = {
    id: PropTypes.string,
    saved: PropTypes.bool,
    toggleHeart: PropTypes.func,
    noteImage: PropTypes.object,
    message: PropTypes.string,
    createdBy: PropTypes.string,
    delete: PropTypes.func
}

export default Note