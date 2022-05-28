
import { useState, useEffect } from 'react'
import { useEndpoint } from '../../hooks/useEndpoint'

import './Reactions.scss'

import Heart from '../../assets/images/reaction-heart.svg'
import Smile from '../../assets/images/reaction-smile.svg'
import Cool from '../../assets/images/reaction-cool.svg'
import Star from '../../assets/images/reaction-star.svg'


export default function Reactions({ noteID, reaction }) {
    const [selectedReaction, setSelectedReaction] = useState(reaction ? reaction : 'heart')
    const [endpoint, setEndpoint] = useState(null)
    const [data, setData] = useState(null)
    const { documents, error } = useEndpoint(endpoint, 'PATCH', data)

    const handleChange = (reactionId) => {
        setSelectedReaction(reactionId)
        setData({ reaction: reactionId })
        console.log('data', data);
        setEndpoint(`/note/update_reaction/${noteID}`)
    }

    useEffect(() => {
        if (documents) {
            console.log('documents', documents)
        }
        if (error) {
            console.log('error', error)
        }
    }, [documents])


    const reactions = [
        {
            id: 'heart',
            name: 'heart',
            image: Heart
        },
        {
            id: 'smile',
            name: 'smile',
            image: Smile
        },
        {
            id: 'cool',
            name: 'cool',
            image: Cool
        },
        {
            id: 'star',
            name: 'star',
            image: Star
        }
    ]

    function ActiveStatus(id, selectedId) {
        return id == selectedId;
    }

    return (
        <ul className='list-reactions'>
            {
                reactions.map(reaction => (
                    <li key={reaction.id} data-active={ActiveStatus(reaction.id, selectedReaction)}>
                        <label className='checkable is-reaction' >
                            <input
                                type="radio"
                                name={`reaction-${noteID}`}
                                value={reaction.id}
                                onChange={(e) => handleChange(e.target.value)}
                            />
                            <img className="icon" src={reaction.image} alt={reaction.name} />
                            <span className='visually-hidden'>{reaction.name}</span>
                        </label>
                    </li>
                    // <li key={reaction.id} className={`reaction is-${reaction.name}`}>

                    //     {reaction.name}
                    // </li>
                ))
            }
        </ul>
    )
}