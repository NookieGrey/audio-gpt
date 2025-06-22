import React, {useEffect} from 'react'

interface ErrorMessageProps {
    message: string
    onClose: () => void
    autoClose?: boolean
    autoCloseDelay?: number
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
                                                       message,
                                                       onClose,
                                                       autoClose = false,
                                                       autoCloseDelay = 5000
                                                   }) => {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, autoCloseDelay)
            return () => clearTimeout(timer)
        }
    }, [autoClose, autoCloseDelay, onClose])

    return (
        <div className="error">
            ⚠️ {message}
        </div>
    )
}

export default ErrorMessage