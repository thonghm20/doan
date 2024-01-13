import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {store , persistor}  from './app/store';
import App from './App';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PersistGate } from 'redux-persist/lib/integration/react';

import {BrowserRouter} from'react-router-dom'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
          <App />

      </BrowserRouter>
      </PersistGate>
    </Provider>
);

