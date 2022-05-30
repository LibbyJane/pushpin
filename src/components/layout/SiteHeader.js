import { Link } from 'react-router-dom'
import { NavLink } from "react-router-dom"
import ReactTooltip from "react-tooltip"

import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useAppContext } from "../../hooks/useAppContext"

import Button from '../Button'
import Avatar from "../Avatar"

import './SiteHeader.scss'
import Logo from '../../assets/images/stamp-uk.svg'
import CreateIcon from '../../assets/icons/envelope.svg'
import LogoutIcon from '../../assets/icons/log-out.svg'

export default function SiteHeader() {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const { headerTitle } = useAppContext()
    console.log(user)

    return (
        <header className='site-header container'>
            <div className='content'>
                <Link className="site-logo" to="/">
                    <img src={Logo} alt="logo" />
                </Link>

                <h1 className="page-title">{headerTitle}</h1>
            </div>

            {user && (
                <nav className="user-nav">
                    <ul>
                        <li className='nav-create' data-tip="Send a note" data-for="tt-send" data-background-color="var(--biro)" >
                            <NavLink to="/create">
                                <img className="icon" src={CreateIcon} alt="Click to send a note" />
                            </NavLink>

                        </li>
                        <li className='nav-account' data-tip="Your account" data-for="tt-account" data-background-color="var(--biro)" >
                            <NavLink to={`/account`}>
                                {user.id && <Avatar id={user.id} />}
                            </NavLink>
                        </li>
                        <li className='nav-logout' data-tip="Log out" data-for="tt-logout" data-background-color="var(--biro)">
                            <button type="button" onClick={logout}>
                                <img className="icon" src={LogoutIcon} alt="logout icon" />
                                <span className="visually-hidden">Log out</span>
                            </button>
                        </li>
                    </ul>
                    <ReactTooltip id="tt-send" className="tooltip" />
                    <ReactTooltip id="tt-account" className="tooltip" />
                    <ReactTooltip id="tt-logout" className="tooltip" />

                </nav>
            )}
            {/* {!user && (
                <nav className="site-nav">
                    <ul>
                        <>
                            <li><NavLink to="/login">Login</NavLink></li>
                            <li><NavLink to="/signup">Signup</NavLink></li>
                        </>
                    </ul>
                </nav>
            )} */}
        </header>
    )
}