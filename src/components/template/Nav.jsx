import './Nav.css';
import React from 'react';

 export default props =>
    <aside className="menu-area">
        <nav className="menu">
            {/*Refatorar e criar um componente*/}
            <a href="#/">
                <i className="fa fa-home"></i>Home
            </a>
            <a href="#/users">
                <i className="fa fa-users"></i>Users
            </a>
        </nav>
    </aside>