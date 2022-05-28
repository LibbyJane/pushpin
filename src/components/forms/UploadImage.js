import { useState, useEffect, useRef } from 'react'
import { useMediaEndpoint } from '../../hooks/useMediaEndpoint'
import Error from '../Error'

export default function UploadImage({ draftImage, fieldId, handleFileUpdate, labelText, endpoint, method, reset, setResponse }) {
    // const { imageURL } = useendpoint('users')
    // const [users, setUsers] = useState([])
    const [image, setImage] = useState(draftImage ? draftImage : null)
    const inputElement = useRef()
    const [data, setData] = useState(null)
    const [imageError, setImageError] = useState(null)

    const { outcome, isLoading, error } = useMediaEndpoint(endpoint, method, data)

    useEffect(() => {
        if (outcome && setResponse) {
            setResponse(outcome)
            console.log('upload image', endpoint, method, data, outcome)
        }

        if (reset) {
            console.log('reset input')
            inputElement.current.value = ''
        }
    }, [outcome, reset, setResponse])

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
        formData.append(`${fieldId}`, selected);
        console.log('form data', formData)
        setData(formData)
        selected.URL = URL.createObjectURL(selected)
        setImage(selected)
        handleFileUpdate(selected)
    }

    return (
        <>
            {labelText &&
                <label htmlFor={fieldId ? fieldId : ''}>{labelText}</label>
            }
            <input
                name={fieldId ? fieldId : 'notePhoto'}
                id={fieldId ? fieldId : 'notePhoto'}
                required
                type="file"
                onChange={handleFileChange}
                ref={inputElement}
            />
            {imageError && <Error message={imageError} />}
        </>
    )
}