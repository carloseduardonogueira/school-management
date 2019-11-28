import React, { Component } from 'react';

import Main from '../template/Main';
import axios from 'axios';
import linguaInformation from '../../services/lingua';



const headerProps = {
  icon: 'university',
  title: 'Escolas',
  subtitle: 'Cadastrar nova escola'
};

const baseUrl = 'http://localhost:3001/escolas';
const initialState = {
  school: { name: '', endereco: '', diretor: '', fone: '' },
  diretores: [],
  list: [],
  isInvalid: true,
  isInvalidPhone: true,
  saved: false,
  lingua :(window && window.lingua) || 'EN'
};

export default class School extends Component {
  state = { ...initialState }

  componentWillMount() {
    axios(baseUrl).then(escolas => {
      axios("http://localhost:3001/diretores").then(diretores => {
        this.setState({ diretores: diretores.data, list: escolas.data });
      });
    });
  }

  componentDidMount(){
    this.setState({ lingua: window.lingua });
  }

  clear() {
    this.setState({ state: initialState });
  }

  save() {
    const school = this.state.school
      axios.post(baseUrl, school)
        .then(res => {
          const list = this.getUpdatedList(res.data)
          this.setState({saved: true});
          setTimeout(() => {this.setState({ school: initialState.school, list, saved: false, isInvalid: true, isInvalidPhone: true })},1000);
        });
  }

  getUpdatedList(school) {
    const list = this.state.list.filter(s => s.id !== school.id);
    list.unshift(school);
    return list;
  }

  updateField(event) {
    const school = { ...this.state.school };
    const regrasTelefone = /^\+\d{2}?\s*\(\d{2}\)\s*\d{4,5}\-?\d{4}$/g;

    let isInvalid = false;
    let isInvalidPhone = false;

    school[event.target.name] = event.target.value;

    // Adicionar as validações aqui!
    for (let key in school) {
      if (school[key] === '') {
        isInvalid = true;
      };

      if (key === 'fone') {
        if (!regrasTelefone.test(school[key])) {
          isInvalidPhone = true;
        };
      };
    };

    if(isInvalidPhone){
      isInvalid = true;
    }

    this.setState({ school, isInvalid, isInvalidPhone });
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
                  value={this.state.school.name}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`name-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for='endereco'>{linguaInformation[`labeladdress-${lingua}`]}</label>
                <input type="text" className='form-control'
                  name='endereco'
                  value={this.state.school.endereco}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`address-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>{linguaInformation[`labelphone-${lingua}`]}</label>
                {
                  this.state.isInvalidPhone && (
                    <div class="alert alert-danger" role="alert">
                      {linguaInformation[`telephone-message-${lingua}`]}
                    </div>
                  )
                }
                <input type='text' className='form-control'
                  name='fone'
                  value={this.state.school.fone}
                  onChange={e => this.updateField(e)}
                  placeholder= {linguaInformation[`telephone-${lingua}`]}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>{linguaInformation[`school-labelprincipal-${lingua}`]}</label>
                <select type='select' className='form-control'
                  name='diretor'
                  value={this.state.school.diretor}
                  onChange={e => this.updateField(e)}
                  required >
                  <option value='' selected disabled>{linguaInformation[`option-${lingua}`]}</option>
                  {this.renderOptions()}
                </select>
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

  renderTable(lingua) {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>{linguaInformation[`table-name-${lingua}`]}</th>
            <th>{linguaInformation[`table-address-${lingua}`]}</th>
            <th>{linguaInformation[`table-telephone-${lingua}`]}</th>
            <th>{linguaInformation[`table-principal-${lingua}`]}</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    return this.state.list.map(school => {
      return (
        <tr key={school.id}>
          <td>{school.name}</td>
          <td>{school.endereco}</td>
          <td>{school.fone}</td>
          <td>{school.diretor}</td>
        </tr>
      )
    })
  }

  renderOptions() {
    return this.state.diretores.map(diretores => {
      return (
        <option>{diretores.name}</option>
      )
    })
  }

  render() {
    const { lingua } = this.state;

    return (
      <React.Fragment>
        <Main {...headerProps}>
          {this.renderForm(lingua)}
          {this.renderTable(lingua)}
        </Main>
      </React.Fragment>
    )
  }
}