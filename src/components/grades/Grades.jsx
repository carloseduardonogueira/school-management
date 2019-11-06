import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const baseUrl = 'http://localhost:3001/materias';
const InitialState = {
  materia: {},
  isEmpty: true,
}

export default class Grades extends Component {
  state = { ...InitialState }

  headerProps(props) {
    return ({
      icon: 'bookbar-chart',
      title: this.props && this.props.materia && this.props.materia.name || "Inválido",
      subtitle: 'Atribuir notas'
    })
  };

  clear() {
    this.setState({ state: this.initialState });
  }

  save() {

  }

  updateField(event) {
    const materia = { ...this.state.materia }

    materia[event.target.name] = event.target.value;

    let isEmpty = false;

    if (materia.name === '')
      isEmpty = true;

    this.setState({ materia, isEmpty });
  }

  render() {
    return (
      <Main {...this.headerProps()}>
        {this.renderTable()}
        {this.renderButtons()}
      </Main>
    )
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    return this.props.materia.alunos.map(aluno => {
      return (
        <tr>
          <td>{aluno}</td>
          <td>
            <input type='text' className='form-control'
              name='nota'
              placeholder='Digite a nota do aluno'
              onChange={e => this.updateField(e)}
              required />
            </td>
        </tr>
      )
    })
  }

  renderButtons() {
    return (
      <div>
        <div className="col-12 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={e => this.save(e)}
            disabled={this.state.isEmpty}>
            Salvar
          </button>

          <button
            className="btn btn-secondary ml-2"
            onClick={e => this.clear(e)}>
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
      </div>
    )
  }
}
