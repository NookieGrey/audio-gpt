import {useState} from 'react'
import ApiKeySetup from './components/ApiKeySetup'
import AudioRecorder from './components/AudioRecorder'
import {ApiKeyProvider} from './contexts/ApiKeyContext'

function App() {
    const [apiKey, setApiKey] = useState<string>('')

    return (
        <ApiKeyProvider value={apiKey}>
            <div className="app">
                <div className="container">
                    <h1 className="header">🎤 Аудио ChatGPT</h1>

                    {!apiKey ? (
                        <ApiKeySetup onApiKeySet={setApiKey}/>
                    ) : (
                        <AudioRecorder onResetApiKey={() => setApiKey('')}/>
                    )}
                </div>
            </div>
        </ApiKeyProvider>
    )
}

export default App