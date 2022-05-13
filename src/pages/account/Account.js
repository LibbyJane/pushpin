import { useState, useEffect } from 'react'
import { useAuthContext } from "../../hooks/useAuthContext"
import { useAppContext } from "../../hooks/useAppContext"

import Profile from '../../components/Profile'
import UserSearch from '../../components/UserSearch'

import './Account.scss'

export default function Account() {
    const { user } = useAuthContext()
    const { dispatchApp } = useAppContext()

    useEffect(() => {
        dispatchApp({ type: 'SET_TITLE', payload: 'Account' })
    }, [])

    return (
        <div className='card'>
            <h1>hello {user.displayName}</h1>
            <Profile></Profile>
            <UserSearch></UserSearch>
        </div>
    )
}