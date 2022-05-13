import { useState, useEffect } from 'react'
import { useAppContext } from "../../hooks/useAppContext"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNotes } from '../../hooks/useNotes'
import NoteList from '../../components/NoteList'
import Error from "../../components/Error"
import FilterList from "../../components/FilterList"

import './Corkboard.css'

export default function Corkboard() {
    const { dispatchApp } = useAppContext()

    useEffect(() => {
        dispatchApp({ type: 'SET_TITLE', payload: 'Welcome' })
    }, [dispatchApp])

    const { user } = useAuthContext()
    const filters = ['all', 'saved', 'has image']
    const [filter, setFilter] = useState('all')

    const { documents, error } = useNotes()

    console.log('docs', documents)
    // const { documents, error } = useCollection(
    //     'notes',
    // )
    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const selectedNotes = documents ? documents.filter(note => {
        switch (filter) {
            case 'all':
                return true
            case 'saved':
                return note.saved
            case 'has image':
                return note.noteImage
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
