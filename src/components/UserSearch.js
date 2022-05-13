import { useState, useEffect } from 'react'

import UserSearchResults from "./UserSearchResults"


export default function UserSearch({ }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [showResults, setShowResults] = useState(false)
    const [query, setQuery] = useState('')

    const handleChange = (e) => {
        setShowResults(false);
        setSearchTerm(e);
    }

    useEffect(() => {
        if (searchTerm.length > 3) {
            setQuery(['displayName', '==', searchTerm])
            setShowResults(true);
        }
    }, [searchTerm])



    return (
        <div className=" ">
            <form className="form-user_search">
                <label>Find a friend</label>

                <input
                    required
                    type="search"
                    onChange={(e) => handleChange(e.target.value)}
                    value={searchTerm}
                />
            </form>

            {showResults && (
                <>
                    <UserSearchResults query={query} />
                </>
            )}
        </div>
    )
}
