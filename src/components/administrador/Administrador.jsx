import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';
import CPF from 'cpf-check';
import linguaInformation from '../../services/lingua';

const headerProps = {
  icon: 'users',
  icon: 'university',
  title: 'Administrador',
  subtitle: 'Cadastrar novo administrador'
};

const baseUrl = 'http://localhost:3001/administradores'
const initialState = {
  administrador: { name: '', surname: '', email: '', phone: '', phone2: '', cpf: '' },
  list: [],
  saved: false,
  isEmpty: true,
  isInvalidEmail: true,
  isInvalidPhone: true,
  isInvalidPhone2: true,
  isInvalidCPF: true,
  isInvalid: true,
  lingua :(window && window.lingua) || 'PT-BR'
}

export default class Administrador extends Component {
  state = { ...initialState }

  componentWillMount() {
    axios(baseUrl)
      .then(res => {
        this.setState({ list: res.data })
      });
  }

  componentDidMount(){
    this.setState({ lingua: window.lingua });
  }

  clear() {
    this.setState({ administrador: initialState.administrador });
  }

  save() {
    const administrador = this.state.administrador
    axios.post(baseUrl, administrador)
      .then(res => {
        const list = this.getUpdatedList(res.data)
        this.setState({ saved: true });
        setTimeout(() => { this.setState({ administrador: initialState.administrador, list, saved: false, isInvalid: true }) }, 1000);
      })
  }

  updateField(event) {
    const administrador = { ...this.state.administrador };
    const nif = require('pt-id').nif;
		const ssn = require("ssn-validator");
    const regrasTelefone = /^\+\d{2}?\s*\(\d{2}\)\s*\d{4,5}\-?\d{4}$/g;
    const regrastelefone = /^(\(\d{3}\)|^\d{3}[.-]?)?\d{3}[.-]?\d{4}$/g;
    const regrasTelefone2 = /^\+\d{2}?\s*\(\d{2}\)\s*\d{4,5}\-?\d{4}$/g;
    //const regrasCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g;
    const regrasEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9\-]+\.[a-z]+(\.[a-z]+)?$/g;

    administrador[event.target.name] = event.target.value;
    this.setState({ administrador });

    let isInvalidPhone = false;
    let isInvalidPhone2 = false;
    let isInvalidCPF = false;
    let isInvalidEmail = false;
    let isEmpty = false;
    let isInvalid = true;

    // Adicionar as validações aqui!

    for (let key in administrador) {
      if (administrador[key] === '') {
        isEmpty = true;
      };

      if (key === 'phone') {
        if (!regrasTelefone.test(administrador[key])) {
          isInvalidPhone = true;
        };
      };
     if (key === 'phone2') {
        if (!regrasTelefone2.test(administrador[key]) && !regrastelefone.test(administrador[key])) {
          isInvalidPhone2 = true;
        };
      };
      if (key === 'cpf') {
        if (/*!regrasCPF.test(administrador[key]) ||*/ !CPF.validate(administrador[key]) &&  !nif.validate(administrador[key], 'personal') && !ssn.isValid(administrador[key])) {
          isInvalidCPF = true;
        };
      };
      if (key === 'email') {
        if (!regrasEmail.test(administrador[key])) {
          isInvalidEmail = true;
        };
      };
    };
    if (!isInvalidCPF && !isInvalidEmail && !isInvalidPhone && !isInvalidPhone2 && !isEmpty) {
      isInvalid = false;
    }
    this.setState({ Administrador, isInvalidPhone, isInvalidPhone2, isInvalidCPF, isInvalidEmail, isEmpty, isInvalid });
  }

  renderForm(lingua) {
    return (
      <form>
        <div className="form">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for="name">{linguaInformation[`labelname-${lingua}`]}</label>
                <input type='text' className='form-control'
                  name='name'
                  value={this.state.administrador.name}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderName-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for="surname">{linguaInformation[`labelsurname-${lingua}`]}</label>
                <input type='text' className='form-control'
                  name='surname'
                  value={this.state.administrador.surname}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderSurname-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>{linguaInformation[`labelCPF-${lingua}`]}:</label>
                {
                  this.state.isInvalidCPF && (
                    <div class="alert alert-danger" role="alert">
                      {linguaInformation[`cpf-message-${lingua}`]}
                        </div>
                  )
                }
                <input type="text" className='form-control'
                  name='cpf'
                  value={this.state.administrador.cpf}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderCPF-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Email:</label>
                {
                  this.state.isInvalidEmail && (
                    <div class="alert alert-danger" role="alert">
                      {linguaInformation[`email-message-${lingua}`]}
                        </div>
                  )
                }
                <input type='text' className='form-control'
                  name='email'
                  value={this.state.administrador.email}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderEmail-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>{linguaInformation[`labelphone-${lingua}`]} ({linguaInformation[`labelTypePersonal-${lingua}`]}):</label>
                {
                  this.state.isInvalidPhone && (
                    <div class="alert alert-danger" role="alert">
                      {linguaInformation[`telephone-message-${lingua}`]}
                        </div>
                  )
                }
                <input type='text' className='form-control'
                  name='phone'
                  value={this.state.administrador.phone}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderPhone-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>{linguaInformation[`labelphone-${lingua}`]} ({linguaInformation[`labelTypeBusiness-${lingua}`]}):</label>
                {
                  this.state.isInvalidPhone2 && (
                    <div class="alert alert-danger" role="alert">
                      {linguaInformation[`telephone-message-${lingua}`]}
                        </div>
                  )
                }
                <input type='text' className='form-control'
                  name='phone2'
                  value={this.state.administrador.phone2}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderPhone-${lingua}`]}
                  required />
              </div>
            </div>
          </div>

          <hr />
          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={e => this.save(e)}
                disabled={this.state.isInvalid}
              >
                {linguaInformation[`buttonsave-${lingua}`]}
                  </button>

              <button
                className="btn btn-secondary ml-2"
                onClick={e => this.clear(e)}
              >
                {linguaInformation[`buttoncancel-${lingua}`]}
                  </button>
            </div>
            <div className="col-12 d-flex justify-content-end">
              {
                this.state.isInvalid && (
                  <div class="alert alert-danger" role="alert">
										{linguaInformation[`save-message-${lingua}`]}
                      </div>
                )
              }
            </ div>
            <div className="col-12 d-flex justify-content-end">
              {
                this.state.saved && (
                  <div class="alert alert-success" role="alert">
										  {linguaInformation[`save-success-${lingua}`]}
                        </div>
                )
              }
            </div>
          </div>
        </div>
      </form>
    )
  }

  getUpdatedList(administrador) {
    const list = this.state.list.filter(p => p.id !== administrador.id);
    list.unshift(administrador);
    return list;
  }

  renderTable(lingua) {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>{linguaInformation[`table-name-${lingua}`]}</th>
            <th>{linguaInformation[`table-surname-${lingua}`]}</th>
            <th>Email</th>
            <th>{linguaInformation[`table-telephone-${lingua}`]} ({linguaInformation[`labelTypePersonal-${lingua}`]})</th>
            <th>{linguaInformation[`table-telephone-${lingua}`]} ({linguaInformation[`labelTypeBusiness-${lingua}`]})</th>
            <th>{linguaInformation[`labelCPF-${lingua}`]}</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    return this.state.list.map(administrador => {
      return (
        <tr key={administrador.id}>
          <td>{administrador.name}</td>
          <td>{administrador.surname}</td>
          <td>{administrador.email}</td>
          <td>{administrador.phone}</td>
          <td>{administrador.phone2}</td>
          <td>{administrador.cpf}</td>
        </tr>
      )
    })
  }

  render() {
    const { lingua } = this.state;

    headerProps.title =  linguaInformation['administrator-title-' + lingua]
    headerProps.subtitle =  linguaInformation['administrator-subtitle-' + lingua]

    return (
      <Main {...headerProps}>
        {this.renderForm(lingua)}
        {this.renderTable(lingua)}
      </Main>
    )
  }

}

