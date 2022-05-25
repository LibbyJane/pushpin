import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from "../../hooks/useAppContext"
import { useEndpoint } from '../../hooks/useEndpoint'
import Error from '../../components/Error'

import './Signup.css'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [displayName, setDisplayName] = useState('')

    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailError, setThumbnailError] = useState(null)
    // const { signup, isPending, error } = useSignup()

    const handleSubmit = (e) => {
        console.log('signup e', e);
        // e.preventDefault()
        // signup(email, password, firstName, lastName displayName)
    }

    useEffect(() => {
        if (!displayName.length) {
            setDisplayName(firstName + lastName)
        }
    }, [firstName, lastName, displayName])

    const handleFileChange = (e) => {
        setThumbnail(null)
        let selected = e.target.files[0]

        if (!selected) {
            setThumbnailError('Please select a file')
            return
        }
        if (!selected.type.includes('image')) {
            setThumbnailError('Selected file must be an image')
            return
        }
        if (selected.size > 100000) {
            setThumbnailError('Image file size must be less than 100kb')
            return
        }

        setThumbnailError(null)
        setThumbnail(selected)
    }

    return (
        <form onSubmit={handleSubmit} className="form-signup card">
            <header className="card-header">
                Sign Up
            </header>

            <fieldset className='cols wrap'>
                <div className="field">
                    <label for="firstName">First Name</label>
                    <input
                        id="firstName"
                        required
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                    />
                </div>

                <div className="field">
                    <label for="lastName">Last Name</label>
                    <input
                        id="lastName"
                        required
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                    />
                </div>

                <div className="field">
                    <label for="displayName">Display Name</label>
                    <input
                        id="displayName"
                        required
                        type="text"
                        onChange={(e) => setDisplayName(e.target.value)}
                        value={displayName}
                    />
                </div>

                <label>
                    <span>email:</span>
                    <input
                        required
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <label>
                    <span>password:</span>
                    <input
                        required
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
                <label>
                    <span>confirm password:</span>
                    <input
                        required
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
            </fieldset>

            <label>
                <span>Profile thumbnail:</span>
                <input
                    required
                    type="file"
                    onChange={handleFileChange}
                />
                {thumbnailError && <Error message={thumbnailError} />}
            </label>
            {/* {!isPending && <button className="btn" type="submit">Sign up</button>}
            {isPending && <button className="btn" disabled type="submit">loading</button>}
            {error && <Error message={error} />} */}
        </form>
    )
}