import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import './index.css'

const style = document.createElement('style');
style.innerHTML = `
  @layer utilities {
    .truncate-3-lines { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  }
`;
document.head.appendChild(style);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
