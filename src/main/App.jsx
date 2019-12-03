import React from 'react';
import { BrowserRouter } from "react-router-dom";

import Routes from './Routes';

window.lingua = localStorage.getItem("window.lingua") || 'PT-BR';

export default props =>
  <BrowserRouter>
    <Routes />
  </BrowserRouter>