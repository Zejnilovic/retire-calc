import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'          // <-- this must exist (built in step 3)
import { DarkModeProvider } from './contexts/DarkModeContext'
import './i18n';
import { LocaleProvider } from './contexts/LocaleContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </DarkModeProvider>
  </React.StrictMode>,
)
