import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'

import './ProjectList.css'

export default function ProjectList({ projects }) {
    return (
        <ul className="list-projects">
            {projects.length === 0 && <p>No projects yet!</p>}
            {projects.map(project => (
                <li key={project.id}  className="card">
                    <Link to={`/projects/${project.id}`}>
                        <h4>{project.name}</h4>
                        <p>Due by {project.dueDate.toDate().toDateString()}</p>
                        <div className="assigned-to">
                            <p><strong>Assigned to:</strong></p>
                            <ul className="list-avatars">
                                {project.assignedUsersList.map(user => (
                                    <li key={user.id}>
                                        <Avatar src={user.photoURL} name={user.displayName} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}
