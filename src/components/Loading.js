import icon from '../assets/icons/loader.svg'
import './Loading.scss'

export default function Loading() {
    return (
      <div className='loader'>
        <img
        src={icon}
        alt="loading"
        className="icon-loading"
        />
      </div>
    )
  }