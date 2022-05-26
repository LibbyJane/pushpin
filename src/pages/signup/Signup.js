import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useAppContext } from '../../hooks/useAppContext'
import { useEndpoint } from '../../hooks/useEndpoint'
import Error from '../../components/Error'

export default function Signup() {
    const { dispatch } = useAuthContext()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [passwordError, setPasswordError] = useState('')
    const [formError, setFormError] = useState('')

    const [endpoint, setEndpoint] = useState(null)
    const [data, setData] = useState(null)
    const { documents, error } = useEndpoint(endpoint, 'POST', data)

    useEffect(() => {
        if (password && confirmPassword) {
            password === confirmPassword ? setPasswordError(null) : setPasswordError('Passwords must match');
        }
    }, [firstName, lastName, displayName, email, password, confirmPassword])

    useEffect(() => {
        if (documents) {
            const payload = {
                user: documents.user,
                token: documents.tokenInfo.token
            }

            dispatch({ type: 'AUTHENTICATED', payload })
        }

        if (error) {
            console.log('returned error', error)
            setFormError(error.response.data.errors[0])
        }
    }, [documents, error])


    const handleSubmit = (e) => {
        e.preventDefault()
        setData({ firstName, lastName, displayName, email, password })
        setEndpoint('register')
    }

    const updateDisplayName = (value) => {
        if (!displayName.length) {
            setDisplayName(value)
        }
    }

    return (<div className="cols">
        <form onSubmit={handleSubmit} className="form-signup card col">
            <header className="card-header">
                Sign Up
            </header>

            <label htmlFor="firstName">First Name <abbr title="used to help friends find you">*</abbr></label>
            <input
                id="firstName"
                required
                type="text"
                minLength="2"
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={(e) => updateDisplayName(e.target.value)}
                value={firstName}
            />

            <label htmlFor="lastName">Last Name <abbr title="used to help friends find you">*</abbr></label>
            <input
                id="lastName"
                required
                type="text"
                minLength="2"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
            />

            <label htmlFor="displayName">Display Name<abbr title="used to help friends find you">*</abbr> (used to sign your notes)</label>
            <input
                id="displayName"
                required
                type="text"
                minLength="2"
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
            />


            <label htmlFor="emailAddress">email: <abbr title="used to help friends find you">*</abbr></label>
            <input
                id="emailAddress"
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label htmlFor="password">password: <abbr title="at least 6 characters">*</abbr></label>
            <input
                id="password"
                required
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                minLength="6"
                maxLength="80"
            />
            <label htmlFor="confirmPassword">confirm password: <abbr title="must match password">*</abbr></label>
            <input
                id="confirmPassword"
                required
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                minLength="6"
                maxLength="80"
            />

            {passwordError && <Error message={passwordError} />}
            {formError && <Error message={formError} />}
            <button className="btn" type="submit">Sign up</button>
        </form>
        <div className="col card is-reversed align-top width-small">
            <h4>Already have an account?</h4>
            <p><Link to="/login">Log in here</Link></p>
        </div>
    </div>
    )
}