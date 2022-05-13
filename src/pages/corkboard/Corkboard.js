import { useState, useEffect } from 'react'

import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import NoteList from '../../components/NoteList'
import Error from "../../components/Error"
import FilterList from "../../components/FilterList"

import './Corkboard.css'

export default function Corkboard() {
    const { user } = useAuthContext()
    const filters = ['all', 'saved', 'has image']
    const [filter, setFilter] = useState('all')

    const { documents, error } = useCollection(
        'notes',
        ['recipientsList', 'array-contains', { 'id': user.uid }],
        ['createdAt', 'desc']
    )
    // const { documents, error } = useCollection(
    //     'notes',
    // )
    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const selectedNotes = documents ? documents.filter(document => {
        switch (filter) {
            case 'all':
                return true
            case 'saved':
                return document.saved
            case 'mine':
                let assignedToMe = false
                document.assignedUsersList.forEach(u => {
                    if (u.id === user.uid) {
                        assignedToMe = true
                    }
                })
                return assignedToMe
            case 'has image':
                return document.noteImage
            default:
                return true
        }
    }) : null

    return (
        <section>
            {documents && <FilterList filters={filters} changeFilter={changeFilter} />}
            {selectedNotes && <NoteList notes={selectedNotes} />}
            {error && (
                <Error message={error} />
            )}
        </section>
    )
}
