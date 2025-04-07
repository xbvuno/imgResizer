import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/bvuno-pico.css'
import App from './App.jsx'

import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nuova versione disponibile. Ricarica la pagina.')
  },
  onOfflineReady() {
    console.log('L’app è pronta per l’uso offline.')
  }
})

window.onload = () => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    MoveHeader();
  }
};

function MoveHeader() {
  const root = document.getElementById('root');
  const header = root.querySelector('header');
  const main = root.querySelector('main');

  if (header && main) main.parentNode.insertBefore(header, main.nextSibling);
}