import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'

const headerProps = {
  icon: 'users',
  title: 'Professores',
  subtitle: 'Cadastrar novo professor'
};

const baseUrl = 'http://localhost:3001/professores'
const initialState = {
  professor: { name: '', surname: '', email: '', cpf: '', address: '', phone: ''},
  list: [],
  isInvalidPhone: true,
  isInvalidCPF: true,
  isInvalidEmail: true,
  saved: false,
  isEmpty: true,
  isInvalid: true
}

export default class Professor extends Component {
  state = {...initialState}

  componentWillMount(){
    axios(baseUrl)
      .then(res => {
          this.setState({ list: res.data})
      });
  }

  clear(){
    this.setState({ professor: initialState.professor });
  }

  save(){
    const professor = this.state.professor
    axios.post(baseUrl, professor)
      .then(res => {
        const list = this.getUpdatedList(res.data)
        this.setState({saved: true});
        setTimeout(() => {this.setState({ professor: initialState.professor, list, saved: false, isInvalid: true })},1000);
      })
  }

  getUpdatedList(professor){
    const list = this.state.list.filter(p => p.id !== professor.id);
    list.unshift(professor);
    return list;
  }

  updateField(event){
    const professor = { ...this.state.professor };
    const regrasTelefone = /^\+?\d{2}?\s*\(\d{2}\)?\s*\d{4,5}\-?\d{4}$/g;
    const regrasCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g;
    const regrasEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9\-]+\.[a-z]+(\.[a-z]+)?$/g;

    professor[event.target.name] = event.target.value;
    this.setState({ professor });

    let isInvalidPhone = false;
    let isInvalidCPF = false;
    let isInvalidEmail = false;
    let isEmpty = false;
    let isInvalid = true;

    // Adicionar as validações aqui!
    
    for (let key in professor) {
      if (professor[key] === '') {
        isEmpty = true;
      };

      if (key === 'phone') {
        if (!regrasTelefone.test(professor[key])) {
          isInvalidPhone = true;
        };
      };
      if (key === 'cpf') {
        if (!regrasCPF.test(professor[key])) {
          isInvalidCPF = true;
        };
      };
      if (key === 'email') {
        if (!regrasEmail.test(professor[key])) {
          isInvalidEmail = true;
        };
      };
    };
    if (!isInvalidCPF && !isInvalidEmail && !isInvalidPhone && !isEmpty){
        isInvalid = false;
    }
    this.setState({ professor, isInvalidPhone, isInvalidCPF, isInvalidEmail, isEmpty, isInvalid });
  }

  renderForm() {
    return (
      <form>
        <div className="form">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for="name">Nome:</label>
                <input type='text' className='form-control'
                  name='name'
                  value={this.state.professor.name}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o nome do professor'
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for="surname">Sobrenome:</label>
                  <input type='text' className='form-control'
                    name='surname'
                    value={this.state.professor.surname}
                    onChange={e => this.updateField(e)}
                    placeholder='Digite o sobrenome do professor'
                    required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>CPF:</label>
                {
                  this.state.isInvalidCPF && (
                    <div class="alert alert-danger" role="alert">
                      Você deve preencher os dados de CPF no padrão: '123.456.789-00'
                    </div>
                  )
                }
                <input type="text" className='form-control'
                  name='cpf'
                  value={this.state.professor.cpf}
                  onChange={e => this.updateField(e)}
                  placeholder="Digite o CPF do professor"
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>E-mail:</label>
                {
                  this.state.isInvalidEmail && (
                    <div class="alert alert-danger" role="alert">
                      Você deve preencher os dados de E-mail no padrão: 'Professor09@puccampinas.com'
                    </div>
                  )
                }
                <input type='text' className='form-control'
                  name='email'
                  value={this.state.professor.email}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o e-mail do professor'
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for='address'>Endereço:</label>
                <input type="text" className='form-control'
                  name='address'
                  value={this.state.professor.address}
                  onChange={e => this.updateField(e)}
                  placeholder="Digite o endereço do professor"
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Telefone:</label>
                {
                  this.state.isInvalidPhone && (
                    <div class="alert alert-danger" role="alert">
                      Você deve preencher os dados de telefone no padrão: '+55 (55) 23321-5454'
                    </div>
                  )
                }
                <input type='text' className='form-control'
                  name='phone'
                  value={this.state.professor.phone}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o telefone do professor'
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
                disabled={this.state.isInvalid }
              >
                Salvar
              </button>

              <button
                className="btn btn-secondary ml-2"
                onClick={e => this.clear(e)}
              >
                Cancelar
              </button>
            </div>
            <div className="col-12 d-flex justify-content-end">
              {
                this.state.isInvalid && (
                  <div class="alert alert-danger" role="alert">
                    Você deve preencher os dados!
                  </div>
                )
              }
              </ div>
              <div className="col-12 d-flex justify-content-end">
              {
                this.state.saved && (
                    <div class="alert alert-success" role="alert">
                        Professor inserido com sucesso!
                    </div>  
                )
              }
            </div>
          </div>
        </div>
      </form>
    )
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th>Endereço</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    return this.state.list.map(professor => {
      return (
        <tr key={professor.id}>
          <td>{professor.name}</td>
          <td>{professor.surname}</td>
          <td>{professor.cpf}</td>
          <td>{professor.email}</td>
          <td>{professor.address}</td>
          <td>{professor.phone}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    )
  }
}