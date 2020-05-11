import React from 'react';
import ReactDOM from 'react-dom';
import Notifications from 'react-notify-toast'; // Toast notifications container at top-level
import './index.css'; // Global CSS
import App from './App';

ReactDOM.render(
  <React.StrictMode>
      <App />
      <Notifications options={{zIndex: 9999}}/>
  </React.StrictMode>,
  document.getElementById('root')
);
