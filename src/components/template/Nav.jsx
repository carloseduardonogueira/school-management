import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default props =>
  <aside className="menu-area">
    <nav className="menu">
      {/*Refatorar e criar um componente*/}
      <Link to="/">
        <i className="fa fa-home"></i>Home
            </Link>
      <Link to="/escolas">
        <i class="fa fa-university"></i>Escolas
            </Link>
      <Link to="/alunos">
        <i class="fa fa-users"></i>Alunos
            </Link>
      <Link to="/diretores">
        <i class="fa fa-users"></i>Diretores
            </Link>
      <Link to="/professores">
        <i class="fa fa-users"></i>Professores
            </Link>
    </nav>
  </aside>