import React from 'react';
import Main from '../template/Main';

import { Redirect } from "react-router-dom";

import Logo from "../../assets/images/logo.png";
import './Login.css';

const initialState = {
  login: '',
  password: '',
  isLogged: false,
  isProfessor: true,
  loginIsInvalid: false,
  passwordIsInvalid: false,
}

export default class Login extends React.Component {
  state = { ...initialState }

  onLogin() {
    const { login, password } = this.state;
    console.log(localStorage.getItem("isLogged"))

    if ((login === 'fek' || login === 'test') && password === 'senha') {
      localStorage.setItem("isLogged", true);
      localStorage.setItem("isProfessor", true);
      this.setState({ isLogged: true, isProfessor: true });
    }

    if((login === 'carlos'  || login === 'pai') && password === 'senha') {
      localStorage.setItem("isLogged", true);
      localStorage.setItem("isProfessor", false);
      this.setState({ isLogged: true, isProfessor: false });
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
      if (this.state.isProfessor) {
        return <Redirect to={"/home"} />
      }

      return <Redirect to={"/notas"} />
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
            <div className="col-12 d-flex justify-content-end">
              {
                this.state.loginIsInvalid && (
                  <div class="alert alert-danger" role="alert">
                    Usuário inválido!
                      </div>
                )
              }
            </ div>
            <input
              type='password'
              name='password'
              placeholder="Digite sua senha"
              value={this.state.password}
              onChange={(e) => this.onChangePassword(e)}
              required
            />
            <div className="col-12 d-flex justify-content-end">
              {
                this.state.passwordIsInvalid && (
                  <div class="alert alert-danger" role="alert">
                    Senha inválida!
                      </div>
                )
              }
            </ div>
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
