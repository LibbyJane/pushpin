import { Link } from 'react-router-dom'

import './NotFound.css'

export default function NotFound() {

    return (
        <>
            <h2>Page Not Found</h2>
            <p>Back to the <Link to={`/`}>home page?</Link></p>
        </>
    )
}