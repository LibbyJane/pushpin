import { useState } from "react"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import Avatar from "../../components/Avatar"
import DeleteIcon from '../../assets/icons/delete.svg'

export default function NoteComments({note, id}) {
    const { user } = useAuthContext()
    const { updateDocument, response } = useFirestore('notes')
    const [newComment, setNewComment] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const commentToAdd = {
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
            content: newComment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random()
        }

        if (!note.comments) {
            note.comments = []
        }

        await updateDocument(id, {
            comments: [...note.comments, commentToAdd],
        })
        if (!response.error) {
            setNewComment('')
        }
    }

    const deleteComment = async (commentId) => {
        const updatedComments = note.comments.filter(item => {return (item.id !== commentId)});
        await updateDocument(id, {
            comments: updatedComments
        })
    }

    return (
        <aside className="note-comments">
            {note.comments && note.comments.length > 0 &&
                <ul>
                { note.comments.map(comment => (
                    <li className={`comment  ${comment.uid === user.uid ? 'user-authored' : ''}`} key={comment.id}>
                        <p className="comment-date">{formatDistanceToNow(note.createdAt.toDate(), {addSuffix: true})}</p>

                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>

                        <div className="comment-author">
                            <Avatar src={comment.photoURL} name={comment.displayName} />
                            {/* <div className="comment-author">{comment.displayName}</div> */}
                        </div>
                        {comment.uid === user.uid &&
                            <button
                                className="comment-delete"
                                type="button"
                                onClick={(e) => deleteComment(comment.id)}
                            >
                                <img src={DeleteIcon} alt="Delete comment" />
                            </button>
                        }
                    </li>
                ))}
            </ul>}

            <form className="add-comment" onSubmit={handleSubmit}>
                <label>
                    <span>Add new comment:</span>
                    <textarea
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                    ></textarea>
                </label>
                <button className="btn">Add Comment</button>
            </form>
        </aside>
    )
}
