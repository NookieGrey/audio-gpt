import {useCallback, useRef, useState} from 'react'

interface UseAudioRecorderOptions {
    onRecordingStart?: () => void
    onRecordingStop?: () => void
    onError?: (error: string) => void
}

interface UseAudioRecorderReturn {
    startRecording: () => Promise<void>
    stopRecording: () => void
    audioBlob: Blob | null
    isSupported: boolean
}

export const useAudioRecorder = (options: UseAudioRecorderOptions = {}): UseAudioRecorderReturn => {
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)

    const isSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

    const startRecording = useCallback(async () => {
        if (!isSupported) {
            options.onError?.('Ваш браузер не поддерживает запись аудио')
            return
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 44100,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            })

            streamRef.current = stream
            audioChunksRef.current = []

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                    ? 'audio/webm;codecs=opus'
                    : 'audio/webm'
            })

            mediaRecorderRef.current = mediaRecorder

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: 'audio/webm'
                })
                setAudioBlob(audioBlob)

                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop())
                    streamRef.current = null
                }

                options.onRecordingStop?.()
            }

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event)
                options.onError?.('Ошибка записи аудио')
            }

            mediaRecorder.start(100)
            options.onRecordingStart?.()

        } catch (error) {
            console.error('Ошибка доступа к микрофону:', error)

            let errorMessage = 'Ошибка доступа к микрофону'
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    errorMessage = 'Доступ к микрофону запрещен. Проверьте разрешения браузера'
                } else if (error.name === 'NotFoundError') {
                    errorMessage = 'Микрофон не найден'
                } else if (error.name === 'NotReadableError') {
                    errorMessage = 'Микрофон уже используется другим приложением'
                }
            }

            options.onError?.(errorMessage)
        }
    }, [isSupported, options])

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
        }
    }, [])

    return {
        startRecording,
        stopRecording,
        audioBlob,
        isSupported
    }
}