import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import React from 'react';

import { Redirect } from "react-router-dom";

import Logo from '../../components/template/Logo';
import Nav from '../../components/template/Nav';
import Footer from '../../components/template/Footer';

export default props => (
  localStorage.getItem("isLogged") ? (
    <div className="app">
      <Logo />
      <Nav />
      {props.children}
      <Footer />
    </div>
  ) : <Redirect to="/login" />
);