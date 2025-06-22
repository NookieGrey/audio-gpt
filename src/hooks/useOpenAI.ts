import {useCallback} from 'react'
import {useApiKey} from '../contexts/ApiKeyContext'
import OpenAI from 'openai'

export const useOpenAI = () => {
    const apiKey = useApiKey()

    const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
    })

    const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
        try {
            const audioFile = new File([audioBlob], 'recording.webm', {
                type: 'audio/webm'
            })

            const transcription = await openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
            })

            return transcription.text
        } catch (error) {
            console.error('Ошибка транскрипции:', error)
            throw new Error('Ошибка распознавания речи')
        }
    }, [openai])

    const getChatResponse = useCallback(async (text: string): Promise<string> => {
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: text
                    }
                ],
                max_tokens: 500
            })

            return completion.choices[0]?.message?.content || 'Извините, не удалось получить ответ'
        } catch (error) {
            console.error('Ошибка ChatGPT:', error)
            throw new Error('Ошибка получения ответа от ChatGPT')
        }
    }, [openai])

    return {
        transcribeAudio,
        getChatResponse
    }
}