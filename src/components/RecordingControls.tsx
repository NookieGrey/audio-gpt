import React from 'react'

interface RecordingControlsProps {
    isRecording: boolean
    isProcessing: boolean
    hasRecording: boolean
    onStartRecording: () => void
    onStopRecording: () => void
    onSendAudio: () => void
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
                                                                 isRecording,
                                                                 isProcessing,
                                                                 hasRecording,
                                                                 onStartRecording,
                                                                 onStopRecording,
                                                                 onSendAudio
                                                             }) => {
    return (
        <div className="controls">
            <button
                className={`btn ${isRecording ? 'btn-recording' : ''}`}
                onClick={onStartRecording}
                disabled={isRecording || isProcessing}
            >
                🎤 {isRecording ? 'Запись...' : 'Начать запись'}
            </button>

            <button
                className="btn"
                onClick={onStopRecording}
                disabled={!isRecording || isProcessing}
            >
                ⏹️ Остановить запись
            </button>

            <button
                className="btn btn-success"
                onClick={onSendAudio}
                disabled={!hasRecording || isProcessing}
            >
                📤 Отправить в ChatGPT
            </button>
        </div>
    )
}

export default RecordingControls