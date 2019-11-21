import React, { Component } from 'react';
import { Prompt } from 'react-router';

import Main from '../template/Main';
import axios from 'axios';

import { Redirect } from "react-router-dom";

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
}

export default class Materia extends Component {
  state = { ...InitialState }

  componentWillMount() {
    axios(baseUrl).then(materia => {
      axios("http://localhost:3001/professores").then(professores => {
        this.setState({ professores: professores.data, list: materia.data })
      });
    })
    axios(baseUrl).then(materia => {
      axios("http://localhost:3001/alunos").then(alunos => {
        this.setState({ alunos: alunos.data, list: materia.data })
      });
    })
  }

  componentWillUnmount() {
    window.onbeforeunload = undefined
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
                  value={this.state.materia.name}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o nome da matéria'
                  required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Professor</label>
                <select type='select' className='form-control'
                  name='professor'
                  value={this.state.materia.professor}
                  onChange={e => this.updateField(e)}>
                  <option value='' selected disabled>Selecione o Professor</option>
                  {this.renderOptions()}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="form-group">
                <label>Alunos</label>
                <select multiple className="form-control"
                  name="alunos"  //criar função apenas na saida
                  onChange={e => this.updateAlunos(e)}>
                  <option value='' selected disabled>Selecione os alunos (Pressione Ctrl para selecionar mais de um)</option>
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
                this.state.isEmpty && (
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
                    Matéria inserida com sucesso!
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
    }
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Professor</th>
            <th>Alterar/Excluir/Notas</th>
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
            <button className='btn btn-warning ml-2'
              onClick={() => this.load(materia)}>
              <i className='fa fa-pencil'></i>
            </button>
            <button className='btn btn-danger ml-2'
              onClick={() => this.remove(materia)}>
              <i className='fa fa-trash'></i>
            </button>
            <button className='btn btn-info ml-2'
              onClick={() => this.setState({ redirect: true, materia_redirect: materia })}>
              <i className='fa fa-bar-chart'></i>
            </button>
            {this.redirect()}
          </td>
        </tr>
      )
    })
  }


  render() {
    const { materia } = this.state;
    const tenhoDados = materia.name === '' || materia.professor === '';

    return (
      <React.Fragment>
        <Prompt
          when={tenhoDados}
          message='Você irá perder seus dados, tem certeza que deseja sair?'
        />
        <Main {...headerProps}>
          {this.renderForm()}
          {this.renderTable()}
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
      return (
        <option>{alunos.name}</option>
      )
    })
  }
}
