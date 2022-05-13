import './Avatar.scss'

export default function Avatar({ src, name }) {
    return (
        <div className="avatar" style={{ backgroundImage: `url(${src})` }}>
            <img src={src} alt={`${name}'s avatar`} title={name} />
        </div>
    )
}