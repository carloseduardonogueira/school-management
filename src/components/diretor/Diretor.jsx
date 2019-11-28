import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import CPF from 'cpf-check';
import linguaInformation from '../../services/lingua';


const headerProps = {
  icon: 'users',
  title: 'Diretores',
  subtitle: 'Cadastrar novo diretor'
};

const baseUrl = 'http://localhost:3001/diretores'
const initialState = {
  diretor: { name: '', surname: '', email: '', cpf: '', address: '', phone: '' },
  list: [],
  isInvalidPhone: true,
  isInvalidCPF: true,
  isInvalidEmail: true,
  saved: false,
  isEmpty: true,
  isInvalid: true,
  lingua :(window && window.lingua) || 'PT-BR'

}

export default class Diretor extends Component {
  state = { ...initialState }

  componentDidMount(){
    this.setState({ lingua: window.lingua });
  }

  componentWillMount() {
    axios(baseUrl)
      .then(res => {
        this.setState({ list: res.data })
      });
  }

  clear() {
    this.setState({ diretor: initialState.diretor });
  }

  load(diretor) {
    this.setState({ diretor })
  }

  remove(diretor) {
    if (window.confirm("Deseja realmente excluir este diretor?")) {
      axios.delete(`${baseUrl}/${diretor.id}`).then(res => {
        const list = this.state.list.filter(p => p !== diretor)
        this.setState({ list })
      })
    }
  }

  save() {
    const diretor = this.state.diretor
    const method = diretor.id ? 'put' : 'post'
    const url = diretor.id ? `${baseUrl}/${diretor.id}` : baseUrl
    axios[method](url, diretor)
      .then(res => {
        const list = this.getUpdatedList(res.data)
        this.setState({ saved: true });
        setTimeout(() => { this.setState({ diretor: initialState.diretor, list, saved: false, isInvalid: true }) }, 1000);
      })
  }

  getUpdatedList(diretor) {
    const list = this.state.list.filter(p => p.id !== diretor.id);
    list.unshift(diretor);
    return list;
  }

  updateField(event) {
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
    if (!isInvalidCPF && !isInvalidEmail && !isInvalidPhone && !isEmpty) {
      isInvalid = false;
    }
    this.setState({ diretor, isInvalidPhone, isInvalidCPF, isInvalidEmail, isEmpty, isInvalid });
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
                  value={this.state.diretor.name}
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
                  value={this.state.diretor.surname}
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
                  value={this.state.diretor.cpf}
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
                  value={this.state.diretor.email}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderEmail-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for='address'>{linguaInformation[`labeladdress-${lingua}`]}</label>
                <input type="text" className='form-control'
                  name='address'
                  value={this.state.diretor.address}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderAddress-${lingua}`]}
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
                  name='phone'
                  value={this.state.diretor.phone}
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

  renderTable(lingua) {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>{linguaInformation[`table-name-${lingua}`]}</th>
            <th>{linguaInformation[`table-surname-${lingua}`]}</th>
            <th>{linguaInformation[`labelCPF-${lingua}`]}</th>
            <th>E-mail</th>
            <th>{linguaInformation[`table-address-${lingua}`]}</th>
            <th>{linguaInformation[`table-telephone-${lingua}`]}</th>
            <th>{linguaInformation[`table-alter-${lingua}`]}/{linguaInformation[`table-remove-${lingua}`]}</th>
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
              onClick={() => this.load(diretor)}>
              <i className='fa fa-pencil'></i>
            </button>
            <button className='btn btn-danger ml-2'
              onClick={() => this.remove(diretor)}>
              <i className='fa fa-trash'></i>
            </button>
          </td>
        </tr>
      )
    })
  }

  render() {
    const { lingua } = this.state;

		headerProps.title =  linguaInformation['director-title-' + lingua]
    headerProps.subtitle =  linguaInformation['director-subtitle-' + lingua]
    
    return (
      <Main {...headerProps}>
        {this.renderForm(lingua)}
        {this.renderTable(lingua)}
      </Main>
    )
  }
}