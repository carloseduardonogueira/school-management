import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import CPF from 'cpf-check';

const headerProps = {
  icon: 'users',
  title: 'Diretores',
  subtitle: 'Cadastrar novo diretor'
};

const baseUrl = 'http://localhost:3001/diretores'
const initialState = {
  diretor: { name: '', surname: '', email: '', cpf: '', address: '', phone: ''},
  list: [],
  isInvalidPhone: true,
  isInvalidCPF: true,
  isInvalidEmail: true,
  saved: false,
  isEmpty: true,
  isInvalid: true
}

export default class Diretor extends Component {
  state = {...initialState}

  componentWillMount(){
    axios(baseUrl)
      .then(res => {
          this.setState({ list: res.data})
      });
  }

  clear(){
    this.setState({ diretor: initialState.diretor });
  }

  load(diretor) {
		this.setState({ diretor })
	}

	remove(diretor){
    if (window.confirm("Deseja realmente excluir este diretor?")){
      axios.delete(`${baseUrl}/${diretor.id}`).then(res => {
        const list = this.state.list.filter(p => p !== diretor)
        this.setState({ list })
      })
    }
	}

  save(){
    const diretor = this.state.diretor
    const method = diretor.id ? 'put' : 'post'
		const url = diretor.id ? `${baseUrl}/${diretor.id}` : baseUrl
    axios[method](url, diretor)
      .then(res => {
        const list = this.getUpdatedList(res.data)
        this.setState({saved: true});
        setTimeout(() => {this.setState({ diretor: initialState.diretor, list, saved: false, isInvalid: true })},1000);
      })
  }

  getUpdatedList(diretor){
    const list = this.state.list.filter(p => p.id !== diretor.id);
    list.unshift(diretor);
    return list;
  }

  updateField(event){
    const diretor = { ...this.state.diretor };
    const regrasTelefone = /^\+\d{2}?\s*\(\d{2}\)\s*\d{4,5}\-?\d{4}$/g;
    const regrasCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g;
    const regrasEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9\-]+\.[a-z]+(\.[a-z]+)?$/g;

    diretor[event.target.name] = event.target.value;
    this.setState({ diretor });

    let isInvalidPhone = false;
    let isInvalidCPF = false;
    let isInvalidEmail = false;
    let isEmpty = false;
    let isInvalid = true;

    // Adicionar as validações aqui!
    
    for (let key in diretor) {
      if (diretor[key] === '') {
        isEmpty = true;
      };

      if (key === 'phone') {
        if (!regrasTelefone.test(diretor[key])) {
          isInvalidPhone = true;
        };
      };
      if (key === 'cpf') {
        if (!regrasCPF.test(diretor[key]) || !CPF.validate(diretor[key])) {
          isInvalidCPF = true;
        };
      };
      if (key === 'email') {
        if (!regrasEmail.test(diretor[key])) {
          isInvalidEmail = true;
        };
      };
    };
    if (!isInvalidCPF && !isInvalidEmail && !isInvalidPhone && !isEmpty){
        isInvalid = false;
    }
    this.setState({ diretor, isInvalidPhone, isInvalidCPF, isInvalidEmail, isEmpty, isInvalid });
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
                  value={this.state.diretor.name}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o nome do diretor'
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for="surname">Sobrenome:</label>
                  <input type='text' className='form-control'
                    name='surname'
                    value={this.state.diretor.surname}
                    onChange={e => this.updateField(e)}
                    placeholder='Digite o sobrenome do diretor'
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
                  value={this.state.diretor.cpf}
                  onChange={e => this.updateField(e)}
                  placeholder="Digite o CPF do diretor"
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>E-mail:</label>
                {
                  this.state.isInvalidEmail && (
                    <div class="alert alert-danger" role="alert">
                      Você deve preencher os dados de E-mail no padrão: 'diretor09@puccampinas.com'
                    </div>
                  )
                }
                <input type='text' className='form-control'
                  name='email'
                  value={this.state.diretor.email}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o e-mail do diretor'
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for='address'>Endereço:</label>
                <input type="text" className='form-control'
                  name='address'
                  value={this.state.diretor.address}
                  onChange={e => this.updateField(e)}
                  placeholder="Digite o endereço do diretor"
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
                  value={this.state.diretor.phone}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o telefone do diretor'
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
                        diretor inserido com sucesso!
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
            <th>Alterar/Excluir</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    return this.state.list.map(diretor => {
      return (
        <tr key={diretor.id}>
          <td>{diretor.name}</td>
          <td>{diretor.surname}</td>
          <td>{diretor.cpf}</td>
          <td>{diretor.email}</td>
          <td>{diretor.address}</td>
          <td>{diretor.phone}</td>
          <td>
						<button className='btn btn-warning'
							onClick = {() => this.load(diretor)}> 
							<i className='fa fa-pencil'></i>
						</button>
						<button className='btn btn-danger ml-2'
							onClick = {() => this.remove(diretor)}> 
							<i className='fa fa-trash'></i>
						</button>
					</td>
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