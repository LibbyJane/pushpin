import { useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { useEndpoint } from './useEndpoint'

export default function UseFriends() {
    const { dispatch } = useAuthContext()
    const { documents } = useEndpoint('users')

    useEffect(() => {
        dispatch({ type: 'FRIENDS', payload: { friends: documents } })
        sessionStorage.setItem('ppFriends', JSON.stringify(documents))
    }, [documents])
}