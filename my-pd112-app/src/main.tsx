import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '/node_modules/antd/dist/reset.css';
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
      <App />
  </Router>,
)


