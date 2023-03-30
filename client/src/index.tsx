import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <CssBaseline />
    <App />
  </BrowserRouter>,
);
