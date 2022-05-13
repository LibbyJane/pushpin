import { projectAuth } from '../firebase/config'
import { useCollection } from '../hooks/useCollection'
import { useDocument } from '../hooks/useDocument'

import { useFirestore } from "../hooks/useFirestore"

import Avatar from "./Avatar"
import Error from "./Error"

export default function UserSearchResults({ query }) {
    console.log('auth', projectAuth.currentUser)
    const { uid } = projectAuth.currentUser
    const { updateDocument, response } = useFirestore('users')
    const { documents, error } = useCollection(
        'users',
        query
    )

    const { document } = useDocument(
        'users',
        uid
    )

    console.log('doc', document)

    const addFriend = async (id) => {


        // user.friends = [...user.friends,  { id: 'pending' }]


        await updateDocument(uid, {
            friends: [...document.friends, { id: id, status: 'pending' }]
        })
    }

    return (
        <aside className="user-list">
            {documents && (
                <ul className="user-list-items">
                    {documents.map(user => {
                        if ((user.id !== uid)) {
                            return <li key={user.id} className="user-list-item">
                                <button type="button" onClick={(e) => addFriend(user.id)}>
                                    <span className="ul-name">{user.displayName}</span>
                                    <Avatar src={user.photoURL} name={user.photoURL} />
                                </button>
                            </li>
                        }
                        else {
                            return null
                        }
                    })}
                </ul>
            )}
            {error && (
                <Error message={error} />
            )}
        </aside>
    )
}
