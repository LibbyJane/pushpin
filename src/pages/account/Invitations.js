import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore } from '../../firebase/config'
import { useFirestore } from "../../hooks/useFirestore"
import { useDocument } from '../../hooks/useDocument'
import { useCollection } from '../../hooks/useCollection'
import Avatar from '../../components/Avatar'

export default function Invitations() {
    const { uid } = projectAuth.currentUser
    const users = useCollection('users').documents
    const { updateDocument } = useFirestore('invitations')
    let pendingInvitationsDocument = useDocument('invitations', 'pending').document
    const [invitations, setInvitations] = useState()

    useEffect(() => {
        if (pendingInvitationsDocument && pendingInvitationsDocument[uid]) {
            let uidArray = pendingInvitationsDocument[uid];
            let invitationsArray = [];

            uidArray.forEach(i => {
                const sender = users.find(item => item.id === i);
                invitationsArray.push(sender)
            });
            setInvitations(invitationsArray)
        }
    }, [pendingInvitationsDocument, uid])

    const handleAcceptInvitation = async (userId) => {
        const userDoc = await projectFirestore.collection('users').doc(uid);
        const newFriends = userDoc.friends ? [...userDoc.friends, userId] : [userId]
        await userDoc.update({
            friends: newFriends
        })

        const index = pendingInvitationsDocument[uid].indexOf(userId)
        const newPendingInvitationsArray = pendingInvitationsDocument[uid].splice(index, 1)
        pendingInvitationsDocument[uid] = newPendingInvitationsArray

        pendingInvitationsDocument[uid].splice(index, 1)
        await updateDocument('pending', pendingInvitationsDocument)
    }

    const handleRejectInvitation = async (userId) => {
        console.log('reject', userId)
        console.log('accept', userId)
        const doc = await projectFirestore.collection('users').doc(uid);


        console.log('doc', doc)
    }

    return (
        <>
            {invitations && (
                <h4>Invitations</h4>
            )}
            {invitations && invitations.map((i) => (
                <li key={i}>
                    <Avatar src={i.imageURL} name={i.displayName} />
                    {i.displayName}

                    <button type="button" onClick={() => handleAcceptInvitation(i.id)}>accept</button>
                    <button type="button" onClick={() => handleRejectInvitation(i.id)}>reject</button>
                </li>
            ))}
        </>
    )
}
