import { useEffect, useState } from "react"
import { useEndpoint } from '../../hooks/useEndpoint'

import { useAppContext } from "../../hooks/useAppContext"
import { useAuthContext } from '../../hooks/useAuthContext'

import NoteList from '../../components/NoteList'
import Error from "../../components/Error"
import FilterList from "../../components/FilterList"


import './Corkboard.css'

export default function Corkboard() {
    const [notes, setNotes] = useState([])
    const [err, setError] = useState([])
    const filters = ['all', 'saved', 'has image']
    const [filter, setFilter] = useState('all')
    const { documents, error } = useEndpoint('notes')


    useEffect(() => {
        if (documents) {
            setNotes(documents);
            setError(null)
        }
        if (error) {
            setError(error);
        }
    }, [documents, error])

    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const selectedNotes = notes ? notes.filter(note => {
        switch (filter) {
            case 'all':
                return true
            case 'saved':
                return note.saved
            case 'has image':
                return note.imageURL
            default:
                return true
        }
    }) : null


    return (
        <section>
            {notes && <FilterList filters={filters} changeFilter={changeFilter} />}
            {selectedNotes && <NoteList notes={selectedNotes} />}
            {err && (
                <Error message={err} />
            )}
        </section>
    )
}
