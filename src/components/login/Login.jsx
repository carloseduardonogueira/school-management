import React from 'react';
import Main from '../template/Main';

import { Redirect } from "react-router-dom";

import Logo from "../../assets/images/logo.png";
import './Login.css';

const initialState = {
  login: '',
  password: '',
  isLogged: false,
}

export default class Login extends React.Component {
  state = { ...initialState }

  onLogin() {
    const { login, password } = this.state;
    console.log(localStorage.getItem("isLogged"))

    if ((login === 'fek' || login === 'test') && password === 'senha') {
      localStorage.setItem("isLogged", true);
      this.setState({ isLogged: true });
    }
  }

  onChangeLogin(e) {
    this.setState({ login: e.target.value });
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    if (this.state.isLogged) {
      return <Redirect to={"/home"} />
    }

    return (
      <Main
        icon='users'
        title='Login'
        subtitle='Entre para utilizar o sistema'
      >
      <div className="login-container">
        <form>
          <img src={Logo} alt="Login" />
          <input
            type='text'
            name='user'
            placeholder="Digite seu usuário"
            value={this.state.login}
            onChange={(e) => this.onChangeLogin(e)}
            required
          />
          <input
            type='password'
            name='password'
            placeholder="Digite sua senha"
            value={this.state.password}
            onChange={(e) => this.onChangePassword(e)}
            required
          />
          <button
            onClick={() => this.onLogin()}
          >
            Entrar
          </button>
        </form>
      </div>
    </Main>
    );
  }

};
