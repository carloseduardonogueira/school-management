import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
  icon: 'star',
  title: 'Notas',
  subtitle: 'Nota dos alunos'
};

const baseUrl = 'http://localhost:3001/ocorrencias';
const InitialState = {
  ocorrencia: { name: '', aluno: ' ', foto: '' },
  alunos: [],
  list: [],
  isInvalid: false,
  saved: false,
  isEmpty: true
}

export default class Ocorrência extends Component {
  state = { ...InitialState }

  componentWillMount() {
    axios(baseUrl).then(ocorrencia => {
      axios("http://localhost:3001/alunos").then(alunos => {
        this.setState({ alunos: alunos.data, list: ocorrencia.data })
      });
    })
  }

  load(ocorrencia) {
    this.setState({ ocorrencia })
  }

  getUpdatedList(ocorrencia) {
    const list = this.state.list.filter(o => o.id != ocorrencia.id)
    list.unshift(ocorrencia);
    return list;
  }

  remove(ocorrencia) {
    if (window.confirm("Deseja realmente excluir esta ocorrência?")) {
      axios.delete(`${baseUrl}/${ocorrencia.id}`).then(res => {
        const list = this.state.list.filter(o => o !== ocorrencia)
        this.setState({ list })
      })
    }
  }

  renderOptions() {
    return this.state.alunos.map(alunos => {
      return (
        <option>{alunos.name}</option>
      )
    })
  }

  renderRows() {
    return this.state.list.map(ocorrencia => {
      return (
        <tr key={ocorrencia.id}>
          <td>{ocorrencia.name}</td>
          <td>{ocorrencia.aluno}</td>
          <td>{ocorrencia.foto}</td>
          <td>
            {<button className='btn btn-warning'
              onClick={() => this.load(ocorrencia)}>
              <i className='fa fa-pencil'></i>
            </button>}
            {<button className='btn btn-danger ml-2'
              onClick={() => this.remove(ocorrencia)}>
              <i className='fa fa-trash'></i>
            </button>}
          </td>
        </tr>
      )
    })
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Materia</th>
            <th>Professor</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderTable()}
      </Main>
    )
  }


}