import CheckIcon from '../../assets/icons/check.svg'
import './Swatch.scss'

export default function Swatch({ value, label, handler }) {
    return (
        <label className='checkable has-swatch' data-swatch={value}>
            <input
                type="radio"
                name="noteColor"
                value={value}
                onChange={(e) => handler(e.target.value)}
            />
            <span className="swatch" style={{ backgroundColor: `${value}`, color: `${value}` }}>
                <img className="icon" src={CheckIcon} alt="selected icon" />
            </span>
            <span className='checkable-text'>{label}</span>
        </label>
    )
}