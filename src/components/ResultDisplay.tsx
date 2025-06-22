import React from 'react'

interface ResultDisplayProps {
    transcription: string
    response: string
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({transcription, response}) => {
    return (
        <div className="result">
            <div className="result-section">
                <h3>📝 Распознанный текст:</h3>
                <p>{transcription}</p>
            </div>
            <div className="result-section">
                <h3>🤖 Ответ ChatGPT:</h3>
                <p>{response}</p>
            </div>
        </div>
    )
}

export default ResultDisplay