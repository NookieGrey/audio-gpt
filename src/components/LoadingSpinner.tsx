import React from 'react'

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading">
            <div className="loading-spinner"></div>
            <p>🔄 Обрабатываем ваше аудио...</p>
        </div>
    )
}

export default LoadingSpinner