import React, {useState} from 'react'

interface ApiKeySetupProps {
    onApiKeySet: (apiKey: string) => void
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({onApiKeySet}) => {
    const [apiKey, setApiKey] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!apiKey.trim()) {
            setError('Пожалуйста, введите API ключ')
            return
        }

        if (!apiKey.startsWith('sk-')) {
            setError('API ключ должен начинаться с "sk-"')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Простая проверка валидности ключа
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Неверный API ключ')
            }

            onApiKeySet(apiKey)
        } catch (error) {
            console.error('Ошибка проверки API ключа:', error)
            setError('Неверный API ключ. Проверьте правильность ввода.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="api-key-setup">
            <h2>🔑 Настройка OpenAI API</h2>
            <p>
                Для работы приложения необходим ваш личный API ключ от OpenAI.
                Ключ будет использоваться только в этом сеансе и не сохраняется.
            </p>

            <div className="api-info">
                <h4>📝 Как получить API ключ:</h4>
                <ol>
                    <li>Перейдите на <a href="https://platform.openai.com" target="_blank"
                                        rel="noopener noreferrer">platform.openai.com</a></li>
                    <li>Войдите в аккаунт или зарегистрируйтесь</li>
                    <li>Перейдите в раздел "API Keys"</li>
                    <li>Нажмите "Create new secret key"</li>
                    <li>Скопируйте созданный ключ</li>
                </ol>
            </div>

            <form onSubmit={handleSubmit} className="api-key-form">
                <div className="form-group">
                    <label htmlFor="apiKey">OpenAI API Key:</label>
                    <input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <div className="error">
                        ⚠️ {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn"
                    disabled={isLoading || !apiKey.trim()}
                >
                    {isLoading ? '🔄 Проверяем ключ...' : '✅ Подтвердить'}
                </button>
            </form>
        </div>
    )
}

export default ApiKeySetup