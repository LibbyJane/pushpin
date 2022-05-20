import { useState, useEffect } from 'react'
import { useMediaEndpoint } from '../../hooks/useMediaEndpoint'
import Error from '../Error'

export default function UploadImage({ draftImage, fieldId, handleFileUpdate, labelText, endpoint, method }) {
    // const { imageURL } = useendpoint('users')
    // const [users, setUsers] = useState([])
    const [image, setImage] = useState(draftImage ? draftImage : null)
    const [data, setData] = useState(null)
    const [imageError, setImageError] = useState(null)

    const { outcome, isLoading, error } = useMediaEndpoint(endpoint, method, data)

    useEffect(() => {
        if (outcome) {
            console.log('upload image', endpoint, method, data, outcome)
        }
    }, [outcome])

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
        const formData = new FormData();
        formData.append('notePhoto', selected);
        console.log('form data', formData)
        setData(formData)
        selected.URL = URL.createObjectURL(selected)
        setImage(selected)
        handleFileUpdate(selected)
    }

    return (
        <>
            <h1>endpoint? {endpoint}</h1>
            {labelText &&
                <label htmlFor={fieldId ? fieldId : ''}>{labelText}</label>
            }
            <input
                name={fieldId ? fieldId : 'notePhoto'}
                id={fieldId ? fieldId : 'notePhoto'}
                required
                type="file"
                onChange={handleFileChange}
            />
            {imageError && <Error message={imageError} />}
        </>
    )
}