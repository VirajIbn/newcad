import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
// import { NotificationContainer } from './components/ui/notification.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={true}
            theme="colored"
            limit={4}
            toastClassName="custom-toast"
            closeButton={true}
            draggablePercent={60}
            enableMultiContainer={false}
            enableHtml={true}
          />
          {/* <NotificationContainer /> */}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  // </StrictMode>,
)
