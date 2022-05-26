import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from "./hooks/useAuthContext"

import NotFound from './pages/notfound/NotFound'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Corkboard from './pages/corkboard/Corkboard'
// import Note from './pages/note/Note'
import Create from './pages/create/Create'
// import Account from './pages/account/Account'

import SiteHeader from './components/layout/SiteHeader'
import SiteFooter from './components/layout/SiteFooter'


function App() {
    const { dispatch, user, authIsReady } = useAuthContext()

    useEffect(() => {
        const tokenValid = localStorage.getItem('ppSessionExpiry') - Date.now()
        const token = localStorage.getItem('ppTkn')
        const userData = localStorage.getItem('ppUser')
        const userDataJson = JSON.parse(userData)

        if (tokenValid && userDataJson) {
            dispatch({ type: 'AUTHENTICATED', payload: { user: userDataJson, token } })
        } else {
            dispatch({ type: 'UNAUTHENTICATED' })
        }
    }, [dispatch])

    return (
        <>
            {authIsReady &&
                <main className="app">
                    <BrowserRouter>
                        {/* <Sidebar /> */}
                        <SiteHeader />

                        <div className="container site-main">
                            <Routes>
                                <Route
                                    path="/"
                                    element={user ? <Corkboard /> : <Navigate to="/login" />}
                                />

                                <Route
                                    path="/create"
                                    element={user ? <Create /> : <Navigate to="/login" />}
                                />

                                {/* <Route
                                    path="/notes/:id"
                                    element={user ? <Note /> : <Navigate to="/login" />}
                                />

                                <Route
                                    path="/account"
                                    element={user ? <Account /> : <Navigate to="/login" />}
                                /> */}

                                <Route
                                    path="/login"
                                    element={!user ? <Login /> : <Navigate to="/" />}
                                />

                                <Route
                                    path="/signup"
                                    element={!user ? <Signup /> : <Navigate to="/" />}
                                />

                                <Route
                                    path="*"
                                    element={<NotFound />}
                                />

                                {/* Nested route test page - /sandbox and sandbox/offers -  */}
                                {/* <Route
                                        path="/sandbox/*"
                                        element={<Sandbox />}
                                    /> */}

                                {/*
                                    <Route
                                        path="/test"
                                        element={(
                                            <>
                                                <h1>Test Page</h1>
                                                <p>Test page content.</p>
                                            </>
                                        )}
                                    /> */}
                            </Routes>
                        </div>

                        <SiteFooter />
                    </BrowserRouter>
                </main>
            }
        </>
    )
}

export default App