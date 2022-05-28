import { useAuthContext } from '../hooks/useAuthContext'
import { useState, useEffect, useRef } from 'react'

import './Avatar.scss'

export default function Avatar({ id, showName }) {
    const { user } = useAuthContext()
    const friends = JSON.parse(sessionStorage.getItem('ppFriends'))
    const friendsRef = useRef(friends).current
    const idRef = useRef(id).current

    let avatarSrc = user.id === idRef ? user : friendsRef ? friendsRef.filter(matchId)[0] : null;

    function matchId(u) {
        return u.id === idRef
    }

    return (
        <>
            {avatarSrc && (
                <div className="avatar" style={{ backgroundImage: `url(${avatarSrc.imageURL})` }}>
                    <img src={avatarSrc.imageURL} alt={`${avatarSrc.displayName}'s avatar`} title={avatarSrc.displayName} />
                </div>
            )}

            {avatarSrc && showName && (
                <span className="avatar-name">{avatarSrc.displayName}</span>
            )}
        </>

    )
}