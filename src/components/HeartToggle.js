
import HeartOutlineIcon from '../assets/icons/heart-outline.svg'
import HeartIcon from '../assets/icons/heart.svg'
import './HeartToggle.scss'

export default function HeartToggle({ val, isSet, callback }) {

    return (
        <label className="checkable is-toggle">
            <input
                type="checkbox"
                value={val}
                checked={isSet ? 'checked' : ''}
                onChange={(e) => callback(e.target.value)}
            />
            {isSet && <img className='icon-heart' src={HeartIcon} alt="note is saved" />}
            {!isSet && <img className='icon-heart-outlined' src={HeartOutlineIcon} alt="click to save this note" />}
            <span className="visually-hidden">Save this note</span>
        </label>
    )
}