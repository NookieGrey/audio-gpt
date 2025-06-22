import React from 'react'

const AudioVisualizer: React.FC = () => {
    return (
        <div className="audio-visualizer">
            {Array.from({length: 8}, (_, index) => (
                <div key={index} className="wave"/>
            ))}
        </div>
    )
}

export default AudioVisualizer