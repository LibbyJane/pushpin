
import './Reactions.scss'

import Heart from '../assets/images/reaction-heart.png'
import HeartIcon from '../assets/icons/heart.svg'
import Smile from '../assets/images/reaction-smile.svg'

export default function Reactions({ id, showName }) {


    return (
        <>
            <img className='reaction is-heart' src={HeartIcon} />
        </>

    )
}