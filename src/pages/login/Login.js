import { useState, useEffect } from 'react'

import { useAppContext } from "../../hooks/useAppContext"
import { useLogin } from '../../hooks/useLogin'

import Button from '../../components/Button'
import Error from '../../components/Error'

import './Login.css'

export default function Login() {
    const { dispatchApp } = useAppContext()

    useEffect(() => {
        dispatchApp({ type: 'SET_TITLE', payload: 'Log In' })
    }, [dispatchApp])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, isPending, error } = useLogin()

    const handleSubmit = (e) => {
        e.preventDefault()
        login(email, password)
    }

    return (
        <form onSubmit={handleSubmit} className="form-login card">
            <header className="card-header">
                Log In
            </header>

            <label>email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
            />

            <label>
                password:
            </label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
            />

            {!isPending && <Button type="submit">log in</Button>}
            {isPending && <Button type="submit" isDisabled={true}>loading</Button>}

            {error && <Error message={error} />}
        </form>
    )
}