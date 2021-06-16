import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Workbox } from 'workbox-window';
import 'i18n';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

if ('serviceWorker' in navigator) {
  const wb = new Workbox('sw.js');

  wb.addEventListener('installed', event => {
    if (event.isUpdate) {
      if (window.confirm(`New content is available!. Click OK to refresh`)) {
        window.location.reload();
      }
    }
  });

  wb.register();
}
