import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode ejecuta efectos dos veces en desarrollo, lo quitamos
// para evitar problemas con llamadas de un solo uso como verificar correo
createRoot(document.getElementById('root')).render(
  <App />
)