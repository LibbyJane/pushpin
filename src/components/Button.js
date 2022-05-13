import PropTypes from 'prop-types'
import './Button.scss'

function Button({ children, variant, type, onClick, isDisabled }) {
    return (
        <button
            type={type}
            className={`btn ${variant ? 'is-' + variant : ''}`}
            disabled={isDisabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

Button.defaultProps = {
    variant: 'primary',
    type: 'button',
    isDisabled: false,
    onClick: null
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.string,
    type: PropTypes.string,
    isDisabled: PropTypes.bool,
    onClick: PropTypes.func
}

export default Button