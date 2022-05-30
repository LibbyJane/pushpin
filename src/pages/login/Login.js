import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"

import { useAppContext } from "../../hooks/useAppContext"
import { useLogin } from '../../hooks/useLogin'

import Button from '../../components/Button'
import Error from '../../components/Error'

import './Login.scss'

export default function Login() {
    const { dispatchApp } = useAppContext()

    useEffect(() => {
        dispatchApp({ type: 'SET_TITLE', payload: 'Welcome' })
    }, [dispatchApp])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, isPending, error } = useLogin()

    const handleSubmit = (e) => {
        e.preventDefault()
        login(email, password)
    }

    return (
        <div className="cols">
            <form onSubmit={handleSubmit} className="form-login card col">
                <header className="card-header">
                    Log In
                </header>

                <label htmlFor="email">email:</label>
                <input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor="password">
                    password:
                </label>
                <input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />

                {!isPending && <Button type="submit">log in</Button>}
                {isPending && <Button type="submit" isDisabled={true}>loading</Button>}

                {error && <Error message={error} />}
            </form>

            <div className="col card is-reversed align-top width-small">
                <h4>Don't have an account yet?</h4>
                <p><Link to="/signup">Sign up here</Link></p>
            </div>
        </div >

    )
}