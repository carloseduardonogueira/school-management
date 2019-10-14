import React from 'react';
import Main from '../template/Main';

import Logo from "../../assets/images/logo.png";
import './Login.css';


export default props =>
  <Main icon='users' title='Login'
  subtitle='Entre para utilizar o sistema'>
    <div className="login-container">
      <form>
        <img src= {Logo} alt= "Login"/>
        <input type='text'
          name='user'
          placeholder="Digite seu usuário" 
          required 
          />
        <input type='text'
          name='password'
          placeholder="Digite sua senha"
          required  
          />
        <button type="submit">Entrar</button>
      </form>
    </div>

  </Main>
  