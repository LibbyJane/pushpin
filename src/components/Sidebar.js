import { NavLink } from "react-router-dom"
import { useAuthContext } from '../hooks/useAuthContext'
import OnlineUsers from '../components/OnlineUsers'

import Avatar from "./Avatar"

import "./Sidebar.css"
import DashboardIcon from '../assets/icons/dashboard.svg'
import AddIcon from '../assets/icons/add.svg'

export default function Sidebar() {
    const { user } = useAuthContext()

    return (
        <aside className="sidebar">
            {user && <>
                <div className="sb-content">
                    <div className="sb-user sb-border">
                        {user.photoURL && <Avatar src={user.photoURL} />}
                        <p>Hey {user.displayName}</p>
                    </div>
                    <nav className="sb-links sb-border">
                        <ul>
                            <li>
                                <NavLink to="/">
                                    <img src={DashboardIcon} alt="dashboard icon" />
                                    <span>Corkboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/create">
                                    <img src={AddIcon} alt="new note icon" />
                                    <span>Send a note</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                    <OnlineUsers />
                </div>
            </>}
        </aside>
    )
}
