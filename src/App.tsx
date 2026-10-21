import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [serverStatus, setServerStatus] = useState<string>('Ready to test')
  const [serverMsg, setServerMsg] = useState<string>('')
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const frontendPort = import.meta.env.VITE_PORT || '5173'

  const checkBackend = async () => {
    try {
      setServerStatus(`Connecting to ${apiBaseUrl}...`)
      const res = await fetch(`${apiBaseUrl}/api/health`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setServerStatus(data.message || 'Connected!')
      setIsOnline(true)
    } catch {
      setServerStatus(`Offline (Backend is not running at ${apiBaseUrl})`)
      setIsOnline(false)
    }
  }

  const fetchBackendMsg = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/message`)
      const data = await res.json()
      setServerMsg(data.message)
    } catch {
      setServerMsg('Failed to reach backend.')
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>RCE Website</h1>
          <p>
            Frontend (Port {frontendPort}) &bull; Backend ({apiBaseUrl})
          </p>
        </div>

        {/* Backend Connectivity Status Box */}
        <div className={`status-card ${isOnline === true ? 'online' : isOnline === false ? 'offline' : ''}`}>
          <div className="status-header">
            <span className={`status-dot ${isOnline === true ? 'green' : isOnline === false ? 'red' : 'yellow'}`}></span>
            <strong>Backend Server Status:</strong> <span>{serverStatus}</span>
          </div>
          <div className="status-buttons">
            <button type="button" className="btn-test" onClick={checkBackend}>
              🔄 Test Health (Port 5000)
            </button>
            <button type="button" className="btn-test" onClick={fetchBackendMsg}>
              📩 Get API Message
            </button>
          </div>
          {serverMsg && <p className="server-msg">Backend response: <em>{serverMsg}</em></p>}
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
