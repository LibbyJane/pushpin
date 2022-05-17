import { useEffect, useState } from "react"
import axios from "axios"
import apiConfig from "../../api/config"

import { useAppContext } from "../../hooks/useAppContext"
import { useAuthContext } from '../../hooks/useAuthContext'
import NoteList from '../../components/NoteList'
import Error from "../../components/Error"
import FilterList from "../../components/FilterList"


import './Corkboard.css'

export default function Corkboard() {
    const [notes, setNotes] = useState([])
    const [error, setError] = useState([])

    const token = localStorage.getItem('ppTkn')


    useEffect(() => {
        const ourRequest = axios.CancelToken.source()




        async function getNotes() {
            try {
                const token = localStorage.getItem('ppTkn')
                const config = {
                    headers: {
                        authorization: "Bearer " + token
                    }
                }
                const response = await axios.get(`https://localhost:4000/notes`, config)
                setNotes(response.data)
            } catch (e) {
                console.log("There was a problem.")
            }
        }
        getNotes()
        return () => {
            ourRequest.cancel()
        }
    }, [token])

    const { user } = useAuthContext()
    const filters = ['all', 'saved', 'has image']
    const [filter, setFilter] = useState('all')


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
            {/* {error && (
                <Error message={error} />
            )} */}
        </section>
    )
}
