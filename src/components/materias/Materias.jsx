import React, { Component } from 'react';
import { Prompt } from 'react-router';

import Main from '../template/Main';
import axios from 'axios';

import { Redirect } from "react-router-dom";
import linguaInformation from '../../services/lingua';

const headerProps = {
  icon: 'book',
  title: 'Matérias',
  subtitle: 'Cadastrar nova matéria'
};

const baseUrl = 'http://localhost:3001/materias';
const InitialState = {
  materia: { name: '', professor: '', alunos: [] },
  professores: [],
  alunos: [],
  list: [],
  isInvalid: false,
  saved: false,
  isEmpty: true,
  redirect: false,
  materia_redirect: {},
  lingua :localStorage.getItem("lingua") || 'PT-BR',
  notas: []
}

export default class Materia extends Component {
  state = { ...InitialState }

  componentDidMount(){
    this.setState({ lingua:localStorage.getItem("lingua") });
  }

  componentWillMount() {
    axios(baseUrl).then(materia => {
      axios("http://localhost:3001/professores").then(professores => {
        this.setState({ professores: professores.data, list: materia.data })
      });    
      axios("http://localhost:3001/alunos").then(alunos => {
        this.setState({ alunos: alunos.data, list: materia.data })
      });
      axios("http://localhost:3001/notas").then(notas => {
        this.setState({ notas: notas.data})
      });      
    })
  }

  clear() {
    this.setState({ state: this.initialState });
  }

  save() {
    const materia = this.state.materia;
    const method = materia.id ? 'put' : 'post'
    const url = materia.id ? `${baseUrl}/${materia.id}` : baseUrl
    axios[method](url, materia).then(res => {
      const list = this.getUpdatedList(res.data)
      this.setState({ saved: true });
      setTimeout(() => { this.setState({ materia: InitialState, isInvalid: true, saved: false }) }, 1000);
    });
  }

  getUpdatedList(materia) {
    const list = this.state.list.filter(m => m.id != materia.id)
    list.unshift(materia);
    return list;
  }

  updateField(event) {
    const materia = { ...this.state.materia }

    materia[event.target.name] = event.target.value;

    let isEmpty = false;

    if (materia.name === '')
      isEmpty = true;

    this.setState({ materia, isEmpty });
  }

  getAlunos(event) {
    let options = event.target.options;
    var alunos = [];
    for (var i = 0; i < options.length; i++)
      if (options[i].selected)
        alunos.push(options[i].value);
    return alunos;
  }

  updateAlunos(event) {
    let alunos = this.getAlunos(event);
    const materia = { ...this.state.materia }
    materia[event.target.name] = alunos;
    let isEmpty = false;

    if (materia.name === '')
      isEmpty = true;

    this.setState({ materia, isEmpty });
    console.log(materia[event.target.name]);
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
                  value={this.state.materia.name}
                  onChange={e => this.updateField(e)}
                  placeholder={linguaInformation[`holderSubject-${lingua}`]}
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>{linguaInformation[`labelteacher-${lingua}`]}</label>
                <select type='select' className='form-control'
                  name='professor'
                  value={this.state.materia.professor}
                  onChange={e => this.updateField(e)}>
                  <option value='' selected disabled>{linguaInformation[`selectChooseTeacher-${lingua}`]}</option>
                  {this.renderOptions()}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="form-group">
                <label>{linguaInformation[`labelstudents-${lingua}`]}</label>
                <select multiple className="form-control"
                  name="alunos"  //criar função apenas na saida
                  onChange={e => this.updateAlunos(e)}>
                  <option value='' selected disabled>
                    {linguaInformation[`selectChooseStudents-${lingua}`]} ({linguaInformation[`pressCtrlToChose-${lingua}`]})
                  </option>
                  {this.renderOptionsal()}
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
                disabled={this.state.isEmpty}
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
                this.state.isEmpty && (
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

  load(materia) {
    this.setState({ materia })
  }

  redirect() {
    if (this.state.redirect) {
      console.log(this.state.materia_redirect)
      return <Redirect to={{ pathname: "/grades", props: this.state.materia_redirect }} />
    }
  }

  remove(materia) {
    if (window.confirm("Deseja realmente excluir este matéria?")) {
      axios.delete(`${baseUrl}/${materia.id}`).then(res => {
        const list = this.state.list.filter(m => m !== materia)
        this.setState({ list })
      })
      axios('http://localhost:3001/notas').then(res => {
        const notas = res.data.filter(r => r.materia_id === materia.id);
        notas.map(nota => {
          axios.delete(`http://localhost:3001/notas/${nota.id}`)
        })
      }); 
    }
  }

  renderTable(lingua) {
    return (
    <table className="table table-hover mt-4">
        <thead>
          <tr>
            <th>{linguaInformation[`labelname-${lingua}`]}</th>
            <th>{linguaInformation[`labelteacher-${lingua}`]}</th>
            <th>{linguaInformation[`table-alter-${lingua}`]}/{linguaInformation[`table-remove-${lingua}`]}/{linguaInformation[`nav-grades-${lingua}`]}</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    return this.state.list.map(materia => {
      return (
        <tr key={materia.id}>
          <td>{materia.name}</td>
          <td>{materia.professor}</td>
          <td>
            <button
              className='btn btn-warning ml-2'
              onClick={() => this.load(materia)}
              type="button"
              data-toggle="tooltip"
              data-placement="top"
              title="Alterar"
            >
              <i className='fa fa-pencil'></i>
            </button>
            <button
              className='btn btn-danger ml-2'
              onClick={() => this.remove(materia)}
              type="button"
              data-toggle="tooltip"
              data-placement="top"
              title="Remover"
            >
              <i className='fa fa-trash'></i>
            </button>
            <button
              className='btn btn-info ml-2'
              onClick={() => this.setState({ redirect: true, materia_redirect: materia })}
              type="button"
              data-toggle="tooltip"
              data-placement="top"
              title="Atribuir notas"
            >
              <i className='fa fa-bar-chart'></i>
            </button>
            {this.redirect()}
          </td>
        </tr>
      )
    })
  }


  render() {
    const { lingua } = this.state;

		headerProps.title =  linguaInformation['subjects-title-' + lingua]
    headerProps.subtitle =  linguaInformation['subjects-subtitle-' + lingua]

    return (
      <React.Fragment>
        <Main {...headerProps}>
          {this.renderForm(lingua)}
          {this.renderTable(lingua)}
        </Main>
      </React.Fragment>
    )
  }

  renderOptions() {
    return this.state.professores.map(professores => {
      return (
        <option>{professores.name}</option>
      )
    })
  }

  renderOptionsal() {
    return this.state.alunos.map(alunos => {
      if(alunos.name !== ""){
        return (
          <option>{alunos.name}</option>
        )
      }
    })
  }
}
