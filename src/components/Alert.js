import { useState } from 'react'
import Button from './Button'
import "./Alert.scss"

export default function Alert({ variant, title, children, message, visible, setVisible }) {
    return (
        <>
            {visible && (
                <aside className={`alert ${variant ? 'is-' + variant : ''} `}>
                    <header className="alert-header">
                        {title && <h4 className="alert-title">{title}</h4>}
                        <Button variant='text' onClick={(e) => setVisible(false)}>
                            x
                            <span className="visually-hidden">Close notification</span>
                        </Button>
                    </header>
                    {message && (
                        <>
                            <p>{message}</p>
                        </>
                    )}
                    {children}
                </aside>
            )}
        </>

    )
}
