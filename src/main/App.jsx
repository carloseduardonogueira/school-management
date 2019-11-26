import React from 'react';
import { BrowserRouter } from "react-router-dom";

import Routes from './Routes';

window.lingua = 'PT';

export default props =>
  <BrowserRouter>
    <Routes />
  </BrowserRouter>