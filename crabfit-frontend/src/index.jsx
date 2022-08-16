import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { setup } from 'goober'
import { shouldForwardProp } from 'goober/should-forward-prop'
import { BrowserRouter } from 'react-router-dom'
import '/src/i18n'

import App from './App'

setup(
  createElement,
  undefined, undefined,
  shouldForwardProp(prop => !prop.startsWith('$'))
)

const root = createRoot(document.getElementById('app'))

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
