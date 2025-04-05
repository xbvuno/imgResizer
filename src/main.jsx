import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './bvuno-pico.css'
import App from './App.jsx'

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nuova versione disponibile. Ricarica la pagina.')
  },
  onOfflineReady() {
    console.log('L’app è pronta per l’uso offline.')
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
