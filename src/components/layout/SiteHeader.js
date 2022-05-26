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
import Create from '../../assets/images/envelope.png'

import CreateIcon from '../../assets/icons/envelope-arrow.svg'
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
                        <li>
                            <NavLink to="/create" className='nav-create'>
                                <img data-tip="Send a note" data-for="send" className="icon is-create" src={CreateIcon} alt="Click to send a note" />
                            </NavLink>
                            <ReactTooltip id="send" className="tooltip" />
                        </li>
                        <li>
                            <Link to={`/account`} className='nav-account'>
                                {user.id && <Avatar src={user.id} />}
                                <p>Hey {user.displayName}</p>
                            </Link>
                        </li>
                        <li>
                            <Button variant="text" onClick={logout}>
                                <img data-tip="Log out" data-for="logout" className="icon is-logout" src={LogoutIcon} alt="logout icon" />
                                <span className="visually-hidden">Log out</span>
                                <ReactTooltip id="logout" className="tooltip" />
                            </Button>
                        </li>
                    </ul>
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