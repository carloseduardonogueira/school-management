import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
  icon: 'bookbar-chart',
  title: "this.props.location.state.materia.name",
  subtitle: 'Atribuir notas'
};

const baseUrl = 'http://localhost:3001/materias';
const InitialState = {

}

export default class Grades extends Component {
  state = { ...InitialState }

  componentWillMount() {

  }

  clear() {
    this.setState({ state: this.initialState });
  }

  save() {
    
  }

  getUpdatedList(materia) {
    const list = this.state.list.filter(m => m.id != materia.id)
    list.unshift(materia);
    return list;
  }

  renderForm() {
    return (
      <form>
        <div className="form">
          <div className="row">
          </div>
        </div>
      </form>
    )
  }
  
  render() {
    return (
      <Main {...headerProps}>

      </Main>
    )
  }

  renderOptions() {
    return this.state.alunos.map(alunos => {
      return (
        <option>{alunos.name}</option>
      )
    })
  }
}
