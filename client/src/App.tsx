import { useState, useEffect } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Connecting to Flask...')
  const [musicData, setMusicData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status || 'Connection successful, but unexpected response.')
      })
      .catch((err) => {
        console.error('Error fetching status:', err)
        setError('Failed to connect to Flask backend. Is it running?')
        setBackendStatus('Connection Failed')
      })

    fetch('/api/data/summary')
      .then((res) => res.json())
      .then((data) => {
        setMusicData(data)
      })
      .catch((err) => {
        console.error('Error fetching music data:', err)
        setError('Failed to get music data from /api/data/summary')
      })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      
      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        Music_Analytics_Full
      </h1>

      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Backend Connection Test</h2>
        <p className="font-mono p-3 bg-gray-700 rounded text-yellow-300">
          {backendStatus}
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-3">Music Data (from CSV/Pandas)</h2>
        <pre className="text-xs p-3 bg-gray-700 rounded overflow-auto h-64">
          {musicData ? JSON.stringify(musicData, null, 2) : 'Loading data...'}
        </pre>
      </div>

    </div>
  )
}

export default App