import React from 'react';
import { BrowserRouter } from "react-router-dom";

import Routes from './Routes';

window.lingua = 'EN';

export default props =>
  <BrowserRouter>
    <Routes />
  </BrowserRouter>