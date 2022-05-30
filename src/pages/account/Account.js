import { useState, useEffect } from 'react'
import { useAuthContext } from "../../hooks/useAuthContext"
import { useAppContext } from "../../hooks/useAppContext"
import { useEndpoint } from '../../hooks/useEndpoint'
import UploadImage from '../../components/forms/UploadImage'
import Error from '../../components/Error'
// import UserSearch from './UserSearch'
// import Invitations from './Invitations'

import './Account.scss'

export default function Account() {
    // const { documents } = useCollection('users')
    //const [friendUID, setFriendUID] = useState('EonKFr7OXXdpDolj4TC7VwDcOtT2')
    // const { document } = useDocument('users', friendUID)
    const { user, dispatch } = useAuthContext()
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailError, setThumbnailError] = useState(null)
    const [imageURL, setImageURL] = useState(null)
    const [imageEndpoint, setImageEndpoint] = useState(null)
    const [resetForm, setResetForm] = useState(false)
    const [response, setResponse] = useState(null)

    const handleFileUpdate = (image) => {
        console.log('file updated', image.URL)
        setImageURL(image.URL)

        setImageEndpoint('/upload/profile_photo');
    }

    useEffect(() => {
        if (response && response.success === true) {
            console.log('success', response)
            let updatedUser = { ...user, imageURL: response.imageUrl }
            localStorage.setItem('ppUser', JSON.stringify(updatedUser))

            console.log('updated user', updatedUser)
            dispatch({ type: 'USER-UPDATE', payload: { updatedUser } })
        }
    }, [response])



    return (
        <div className="cols">
            <div className='card col'>
                <h1>hello {user.displayName}</h1>
                <UploadImage
                    fieldId="profilePhoto"
                    labelText="Profile image"
                    handleFileUpdate={handleFileUpdate}
                    setResponse={setResponse}
                    endpoint={imageEndpoint}
                    method='POST'
                    reset={resetForm}
                />
                {/* <UserSearch></UserSearch>
        <Invitations users={documents}></Invitations> */}
            </div>

            <div className='card col'>
                <h1>hello {user.displayName}</h1>
                {/* <UserSearch></UserSearch>
        <Invitations users={documents}></Invitations> */}
            </div>
        </div>

    )
}