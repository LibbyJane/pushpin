import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from '../../hooks/useCollection'
import { useDocument } from '../../hooks/useDocument'
import UserSearch from './UserSearch'
import Invitations from './Invitations'
import './Account.scss'

export default function Account() {
    const [friendUID, setFriendUID] = useState('EonKFr7OXXdpDolj4TC7VwDcOtT2')
    const { documents } = useCollection('users')
    const { document } = useDocument('users', friendUID)
    const { user } = useAuthContext()

    return (
        <div className='card'>
            <h1>hello {user.displayName}</h1>
            <UserSearch></UserSearch>
            <Invitations users={documents}></Invitations>
        </div>
    )
}