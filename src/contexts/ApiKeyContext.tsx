import React, {createContext, useContext} from 'react'

const ApiKeyContext = createContext<string>('')

export const ApiKeyProvider: React.FC<{ children: React.ReactNode; value: string }> = ({
                                                                                           children,
                                                                                           value
                                                                                       }) => (
    <ApiKeyContext.Provider value={value}>
        {children}
    </ApiKeyContext.Provider>
)

export const useApiKey = () => {
    const context = useContext(ApiKeyContext)
    if (!context) {
        throw new Error('useApiKey must be used within an ApiKeyProvider')
    }
    return context
}