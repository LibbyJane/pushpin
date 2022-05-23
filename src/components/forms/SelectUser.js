import { useState, useEffect, useRef } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEndpoint } from '../../hooks/useEndpoint'

export default function SelectUsers({ handler, reset }) {
    const { documents } = useEndpoint('users')
    const [users, setUsers] = useState([])
    const { user } = useAuthContext()
    const selectInputRef = useRef();

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
        if (documents) {
            let usersList = documents.map(userObject)
            usersList.splice(usersList.indexOf(null), 1) // remove empty spot left by current user
            setUsers(usersList)
        }

        if (reset) {
            selectInputRef.current.clearValue();
        }
    }, [documents, reset])

    return (
        <Select
            className='react-select-container'
            classNamePrefix="react-select"
            onChange={(option) => handler(option)}
            options={users}
            ref={selectInputRef}
            isMulti
        />
    )
}