import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

import { Redirect } from "react-router-dom";
import linguaInformation from '../../services/lingua';

const baseUrl = 'http://localhost:3001/notas';
const initialState = {
  isInvalid: false,
  grades: {},
  saved: false, 
  old_grades: [], 
  return: false,
  unchanged: true,
  lingua:(window && window.lingua) || 'PT-BR',
}

export default class Grades extends Component {
  state = { ...initialState }

  headerProps(props) {
    return ({
      icon: 'bookbar-chart',
      title: this.props && this.props.materia && this.props.materia.name || "Inválido",
      subtitle: linguaInformation['grades-subtitle-' + window.lingua]
    })
  };

  componentDidMount(){
    const materia = this.props.materia
    const grades = {}

    axios(baseUrl).then(res => {
      const notas = res.data.filter(r => r.materia_id === materia.id);
      for(let key in notas[0]){
        grades[key] = notas[0][key]
      }

      this.setState({old_grades: notas})
    }); 

    if(Object.keys(grades).length === 0 && grades.constructor === Object){
      materia.alunos.map(aluno => {
        grades[aluno] = ""
      })
      grades["materia_id"]= materia.id
    } 

    this.setState({grades, lingua: window.lingua })
  }

  return() {
    if (this.state.return) {
      return <Redirect to="/materias" />
    }
  }

  clear() {
    const old_grades = this.state.old_grades
    const grades = this.state.grades
    if(old_grades.length == 0){
      for(let key in grades){
        grades[key] = ""
      } 
    }
    else{
      for(let key in old_grades[0]){
        grades[key] = old_grades[0][key]
      } 
    }
    this.setState({grades, isInvalid: false, unchanged:true})
  }

  save() {
    const grades = this.state.grades
    const method = grades.id ? 'put' : 'post'
    const url = grades.id ? `${baseUrl}/${grades.id}` : baseUrl

    axios[method](url, grades).then(res => {
      this.setState({ saved: true });
      setTimeout(() => { this.setState({ isInvalid: true, saved: false }) }, 1000);
      console.log(this.state.grades)
    });
  }

  updateField(event) {
    const grades = { ...this.state.grades }
    const regras = ["0", "0,5", "1", "1,5", "2", "2,5", "3", "3,5","4", "4,5", "5", "5,5", "6", "6,5", "7", "7,5", "8", "8,5", "9", "9,5", "10"]
    grades[event.target.name] = event.target.value;
    let isInvalid = false;
    for (let key in grades) {
      console.log(key)
			if (regras.indexOf(grades[key]) < 0 && key !== "materia_id" && key !== "id") {
				isInvalid = true;
      };
    }
    this.setState({ grades, isInvalid , unchanged:false});
  }

  redirect(){
    if(this.state.saved){
      return <Redirect to={ "/materias"} />
    }
  }

  render() {
    
    return (
      <Main {...this.headerProps()}>
        {this.renderTable()}
        {this.renderButtons()}
        {this.redirect()}
        {this.return()}
      </Main>
    )
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>{linguaInformation[`student-name-${this.state.lingua}`]}</th>
            <th>{linguaInformation[`student-grade-${this.state.lingua}`]}</th>
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
              name={aluno}
              value={this.state.grades[aluno]}
              placeholder={linguaInformation[`placeholder-grade-${this.state.lingua}`]}
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
          {!this.state.unchanged && <button
            className="btn btn-primary"
            onClick={e => this.save(e)}
            disabled={this.state.isInvalid}>
            {linguaInformation[`buttonsave-${this.state.lingua}`]}
          </button>}

         {!this.state.unchanged && <button
            className="btn btn-secondary ml-2"
            onClick={e => this.clear(e)}>
            {linguaInformation[`buttoncancel-${this.state.lingua}`]}
          </button>}

          {this.state.unchanged && <button
            className="btn btn-secondary ml-2"
            onClick={e => this.setState({return: true})}>
            {linguaInformation[`buttonreturn-${this.state.lingua}`]}
          </button>}
        </div>
        <div className="col-12 d-flex justify-content-end">
          {
            this.state.isInvalid && (
              <div class="alert alert-danger" role="alert">
                {linguaInformation[`grades-invalid-${this.state.lingua}`]}
              </div>
            )
          }
        </ div>
      </div>
    )
  }
}
