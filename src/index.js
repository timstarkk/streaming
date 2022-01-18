import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { AuthProvider } from './authContext';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import AuthComponent from './AuthComponent';

Amplify.configure(config);

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <React.StrictMode>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}>
            </Route>
            <Route path="/auth" element={<AuthComponent />}>
            </Route>
          </Routes>
      </React.StrictMode>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
