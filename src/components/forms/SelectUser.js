import { useState, useEffect } from 'react'
import Select from 'react-select'
import { useEndpoint } from '../../hooks/useEndpoint'

export default function SelectUsers({ handler }) {
    const { documents } = useEndpoint('users')
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (documents) {
            console.log('documents', documents)
            const usersList = documents.map(u => {

                return {
                    value: {
                        displayName: u.displayName,
                        imageURL: u.imageURL,
                        id: u.id
                    },
                    label: u.displayName
                }
            })

            setUsers(usersList)
        }
    }, [documents])


    return (
        <Select
            className='react-select-container'
            classNamePrefix="react-select"
            onChange={(option) => handler(option)}
            options={users}
            isMulti
        />
    )
}