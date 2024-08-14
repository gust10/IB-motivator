import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './Register.jsx'
import Login from './Login.jsx'
import Page from './Page.jsx'
import Survey from './Survey.jsx'
import Center from './Center.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/page',
    element: <Page />
  },
  {
    path: '/survey',
    element: <Survey />
  },
  {
    path: '/center',
    element: <Center />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
