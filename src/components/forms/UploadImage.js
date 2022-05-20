import { useState, useEffect } from 'react'
import { useEndpoint } from '../../hooks/useEndpoint'
import Error from '../Error'

export default function UploadImage({ draftImage, fieldId, labelText, handleFileUpdate, endpoint, method, handleResponse }) {
    // const { imageURL } = useEndpoint('users')
    // const [users, setUsers] = useState([])
    const [image, setImage] = useState(draftImage ? draftImage : null)
    const [data, setData] = useState(null)
    const [imageError, setImageError] = useState(null)

    const { documents, error } = useEndpoint(endpoint, method, data)

    useEffect(() => {
        if (handleResponse) {
            handleResponse(documents);
        }
    }, [documents])

    const handleFileChange = (e) => {
        setImage(null)
        let selected = e.target.files[0]

        if (!selected) {
            setImageError('Please select a file')
            return
        }
        if (!selected.type.includes('image')) {
            setImageError('Selected file must be an image')
            return
        }

        if (selected.size > 100000) {
            setImageError('Image file size must be less than 100kb')
            return
        }

        setImageError(null)
        setImage(selected)
        setData(selected.name)
        selected.URL = URL.createObjectURL(selected)
        handleFileUpdate(selected.URL)
    }



    return (
        <>
            {labelText &&
                <label htmlFor={fieldId ? fieldId : ''}>{labelText}</label>
            }
            <input
                name={fieldId ? fieldId : 'noteImage'}
                id={fieldId ? fieldId : 'noteImage'}
                required
                type="file"
                onChange={handleFileChange}
            />
            {imageError && <Error message={imageError} />}
        </>
    )
}