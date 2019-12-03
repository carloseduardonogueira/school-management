import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import CPF from 'cpf-check';
import linguaInformation from '../../services/lingua';

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
  isInvalid: true,
  lingua :(window && window.lingua) || 'PT-BR'
}

export default class Professor extends Component {
  state = {...initialState}

  componentDidMount(){
    this.setState({ lingua: window.lingua });
  }

  componentWillMount(){
    axios(baseUrl)
      .then(res => {
          this.setState({ list: res.data})
      });
  }

  clear(){
    this.setState({ professor: initialState.professor });
  }

  load(professor) {
		this.setState({ professor })
	}

	remove(professor){
    if (window.confirm("Deseja realmente excluir este professor?")){
      axios.delete(`${baseUrl}/${professor.id}`).then(res => {
        const list = this.state.list.filter(p => p !== professor)
        this.setState({ list })
      })
    }
	}

  save(){
    const professor = this.state.professor
    const method = professor.id ? 'put' : 'post'
		const url = professor.id ? `${baseUrl}/${professor.id}` : baseUrl
    axios[method](url, professor)
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
    const nif = require('pt-id').nif;
		const ssn = require("ssn-validator");
    const regrasTelefone = /^\+\d{2}?\s*\(\d{2}\)\s*\d{4,5}\-?\d{4}$/g;
    //const regrasCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g;
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
        if (/*!regrasCPF.test(professor[key]) || */ !CPF.validate(professor[key]) &&  !nif.validate(professor[key], 'personal') && !ssn.isValid(professor[key])) {
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
                  value={this.state.professor.name}
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
                    value={this.state.professor.surname}
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
                  value={this.state.professor.cpf}
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
                  value={this.state.professor.email}
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
                  value={this.state.professor.address}
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
                  value={this.state.professor.phone}
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
                disabled={this.state.isInvalid }
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
            <th>Email</th>
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
    return this.state.list.map(professor => {
      return (
        <tr key={professor.id}>
          <td>{professor.name}</td>
          <td>{professor.surname}</td>
          <td>{professor.cpf}</td>
          <td>{professor.email}</td>
          <td>{professor.address}</td>
          <td>{professor.phone}</td>
          <td>
						<button className='btn btn-warning'
							onClick = {() => this.load(professor)}> 
							<i className='fa fa-pencil'></i>
						</button>
						<button className='btn btn-danger ml-2'
							onClick = {() => this.remove(professor)}> 
							<i className='fa fa-trash'></i>
						</button>
					</td>
        </tr>
      )
    })
  }

  render() {
    const { lingua } = this.state;

		headerProps.title =  linguaInformation['teacher-title-' + lingua]
    headerProps.subtitle =  linguaInformation['teacher-subtitle-' + lingua]
    
    return (
      <Main {...headerProps}>
        {this.renderForm(lingua)}
        {this.renderTable(lingua)}
      </Main>
    )
  }
}