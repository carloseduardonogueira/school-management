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
      axios("http://localhost:3001/materias").then(materias => {
        this.setState({ materias: materias.data, notas: notas.data })
      });
    })
  }

  renderTable() {
    const { notas, materias } = this.state;

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
          {
            notas.map(nota => {
              const nomeAluno = Object.keys(nota)[0];
              const infoMateria = materias.filter(materia => materia.id === nota.materia_id ? materia.name : '')[0];
    
              return (
                <tr>
                  <td>{nomeAluno}</td>
                  <td>{infoMateria.name}</td>
                  <td>{infoMateria.professor}</td>
                  <td>{nota[nomeAluno]}</td>
                </tr>
              )
            })
          }
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