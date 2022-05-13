import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from "./hooks/useAuthContext"

import Corkboard from './pages/corkboard/Corkboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Note from './pages/note/Note'
import NotFound from './pages/notfound/NotFound'
import Account from './pages/account/Account'
import Signup from './pages/signup/Signup'

// import Sandbox from './pages/sandbox/Sandbox'

import SiteHeader from './components/layout/SiteHeader'
// import Sidebar from './components/Sidebar'

import './App.scss'

function App() {
    const { authIsReady, user } = useAuthContext()
    // const [pageTitle, setPageTitle] = useState('all')
    // const { headerTitle } = useStateContext()

    return (
        <>
            {authIsReady && (
                <main className="app">
                    <BrowserRouter>
                        {/* <Sidebar /> */}
                        <SiteHeader />

                        <div className="container">
                            <Routes>
                                <Route
                                    path="/"
                                    element={user ? <Corkboard /> : <Navigate to="/login" />}
                                />

                                <Route
                                    path="/create"
                                    element={user ? <Create /> : <Navigate to="/login" />}
                                />

                                <Route
                                    path="/notes/:id"
                                    element={user ? <Note /> : <Navigate to="/login" />}
                                />

                                <Route
                                    path="/account"
                                    element={user ? <Account /> : <Navigate to="/login" />}
                                />

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
                    </BrowserRouter>
                </main>
            )}
        </>
    )
}

export default App