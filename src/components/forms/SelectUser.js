import { useState, useEffect, useRef } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'

export default function SelectUsers({ handler, reset }) {
    const [friendsArray, setFriendsArray] = useState([])
    const { user } = useAuthContext()
    const friends = JSON.parse(sessionStorage.getItem('ppFriends'))
    const selectInputRef = useRef();
    const friendsRef = useRef(friends).current

    const userObject = (u) => {
        if (u.id != user.id) {
            return {
                value: {
                    displayName: u.displayName,
                    imageURL: u.imageURL,
                    id: u.id
                },
                label: u.displayName
            }
        } else {
            return null
        }
    }

    useEffect(() => {
        if (friendsRef) {
            let tempFriends = friendsRef.map(userObject)
            tempFriends.splice(tempFriends.indexOf(null), 1) // remove empty spot left by current user
            setFriendsArray(tempFriends)
        }

        if (reset) {
            selectInputRef.current.clearValue();
        }
    }, [friendsRef, reset])


    return (
        <>
            <Select
                className='react-select-container'
                classNamePrefix="react-select"
                onChange={(option) => handler(option)}
                options={friendsArray}
                ref={selectInputRef}
                isMulti
            />
        </>
    )
}