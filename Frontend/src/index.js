import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './core/i18n/i18n';
import FullPageLoader from './GenericComponents/FullPageLoader/FullPageLoader';

const loadingMarkup = (
  <FullPageLoader />
)

ReactDOM.render(
  <Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
