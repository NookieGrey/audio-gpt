import React, {useCallback, useEffect, useRef, useState} from 'react'
import RecordingControls from './RecordingControls'
import AudioVisualizer from './AudioVisualizer'
import LoadingSpinner from './LoadingSpinner'
import ResultDisplay from './ResultDisplay'
import ErrorMessage from './ErrorMessage'
import {useAudioRecorder} from '../hooks/useAudioRecorder'
import {useOpenAI} from '../hooks/useOpenAI'

export interface AudioRecorderState {
    isRecording: boolean
    isProcessing: boolean
    hasRecording: boolean
    recordingTime: number
}

export interface ChatGPTResponse {
    transcription: string
    response: string
}

interface AudioRecorderProps {
    onResetApiKey: () => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({onResetApiKey}) => {
    const [state, setState] = useState<AudioRecorderState>({
        isRecording: false,
        isProcessing: false,
        hasRecording: false,
        recordingTime: 0
    })

    const [result, setResult] = useState<ChatGPTResponse | null>(null)
    const [error, setError] = useState<string>('')

    const recordingTimerRef = useRef<NodeJS.Timeout>()
    const {transcribeAudio, getChatResponse} = useOpenAI()

    const {startRecording, stopRecording, audioBlob} = useAudioRecorder({
        onRecordingStart: () => {
            setState(prev => ({...prev, isRecording: true, recordingTime: 0}))
            setError('')
            setResult(null)

            recordingTimerRef.current = setInterval(() => {
                setState(prev => ({...prev, recordingTime: prev.recordingTime + 1}))
            }, 1000)
        },
        onRecordingStop: () => {
            setState(prev => ({
                ...prev,
                isRecording: false,
                hasRecording: true
            }))

            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current)
            }
        },
        onError: (errorMessage) => {
            setError(errorMessage)
            setState(prev => ({
                ...prev,
                isRecording: false,
                isProcessing: false
            }))

            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current)
            }
        }
    })

    const handleStartRecording = useCallback(async () => {
        try {
            await startRecording()
        } catch (error) {
            setError('Ошибка начала записи')
        }
    }, [startRecording])

    const handleStopRecording = useCallback(() => {
        stopRecording()
    }, [stopRecording])

    const handleSendAudio = useCallback(async () => {
        if (!audioBlob) {
            setError('Нет записанного аудио для отправки')
            return
        }

        setState(prev => ({...prev, isProcessing: true}))
        setError('')

        try {
            // Транскрипция аудио
            console.log('Начинаем транскрипцию...')
            const transcription = await transcribeAudio(audioBlob)
            console.log('Транскрипция:', transcription)

            // Получение ответа от ChatGPT
            console.log('Отправляем в ChatGPT...')
            const response = await getChatResponse(transcription)
            console.log('Ответ ChatGPT:', response)

            setResult({
                transcription,
                response
            })

            setState(prev => ({
                ...prev,
                isProcessing: false,
                hasRecording: false
            }))

        } catch (error) {
            console.error('Ошибка обработки аудио:', error)
            setError(`Ошибка обработки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
            setState(prev => ({...prev, isProcessing: false}))
        }
    }, [audioBlob, transcribeAudio, getChatResponse])

    const getStatusText = () => {
        if (state.isRecording) return 'Идет запись... Говорите в микрофон'
        if (state.isProcessing) return 'Обрабатываем ваше аудио...'
        if (state.hasRecording) return 'Запись завершена. Готов к отправке'
        if (result) return 'Обработка завершена! Можете записать новое аудио'
        return 'Готов к записи'
    }

    const getStatusClass = () => {
        if (state.isRecording) return 'status-recording'
        if (state.isProcessing) return 'status-processing'
        if (state.hasRecording || result) return 'status-ready'
        return ''
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current)
            }
        }
    }, [])

    return (
        <>
            <div className="api-key-controls">
                <div className="api-key-info">
                    API ключ настроен ✅
                </div>
                <button
                    className="btn btn-danger"
                    onClick={onResetApiKey}
                >
                    🔑 Сменить ключ
                </button>
            </div>

            <RecordingControls
                isRecording={state.isRecording}
                isProcessing={state.isProcessing}
                hasRecording={state.hasRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onSendAudio={handleSendAudio}
            />

            {state.isRecording && (
                <>
                    <AudioVisualizer/>
                    <div className="recording-time">
                        {formatTime(state.recordingTime)}
                    </div>
                </>
            )}

            <div className={`status ${getStatusClass()}`}>
                {getStatusText()}
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError('')}/>}

            {state.isProcessing && <LoadingSpinner/>}

            {result && (
                <ResultDisplay
                    transcription={result.transcription}
                    response={result.response}
                />
            )}
        </>
    )
}

export default AudioRecorder