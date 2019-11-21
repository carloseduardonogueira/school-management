import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
  icon: 'star',
  title: 'Notas',
  subtitle: 'Nota dos alunos'
};

const baseUrl = 'http://localhost:3001/notas';
const InitialState = {
  notas: [],
  materias: [],
}

export default class Ocorrência extends Component {
  state = { ...InitialState }

  componentWillMount() {
    axios(baseUrl).then(notas => {
      this.setState({ notas: notas.data })
      axios("http://localhost:3001/materias").then(materias => {
        this.setState({ materias: materias.data })
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
    const { notas, materias } = this.state;
    const finalNotas = [];
    
    notas.forEach(nota => {
      const objetoKey = Object.entries(nota);
      objetoKey.forEach(info => {

      });
    })

    console.log(this.state.notas[0]);
    return (
        <tr>
          <td></td>
        </tr>
      )

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