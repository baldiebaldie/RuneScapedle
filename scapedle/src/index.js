import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-FLY4XP6YV9');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// Send Core Web Vitals to GA4
reportWebVitals(({ name, delta }) => {
  ReactGA.event(name, {
    category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    nonInteraction: true,
  });
});
