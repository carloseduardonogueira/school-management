import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';
import linguaInformation from '../../services/lingua';


const headerProps = {
  icon: 'users',
  title: 'Ocorrências',
  subtitle: 'Cadastrar nova Ocorrência'
};

const baseUrl = 'http://localhost:3001/ocorrencias';
const InitialState = {
  ocorrencia: { name: '', aluno: '', foto: '' },
  alunos: [],
  list: [],
  isInvalid: false,
  saved: false,
  isEmpty: true,
  path: '',
  lingua :(window && window.lingua) || 'PT-BR'
}

export default class Ocorrência extends Component {
  state = { ...InitialState }

  componentDidMount(){
    this.setState({ lingua: window.lingua });
  }

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

  clear() {
    this.setState({ state: this.initialState });
  }

  save() {
    const ocorrencia = this.state.ocorrencia;
    const method = ocorrencia.id ? 'put' : 'post'
    const url = ocorrencia.id ? `${baseUrl}/${ocorrencia.id}` : baseUrl
    axios[method](url, ocorrencia).then(res => {
      const list = this.getUpdatedList(res.data)
      this.setState({ saved: true });
      setTimeout(() => { this.setState({ ocorrencia: InitialState, isInvalid: true, saved: false }) }, 1000);
    });
  }

  getUpdatedList(ocorrencia) {
    const list = this.state.list.filter(o => o.id != ocorrencia.id)
    list.unshift(ocorrencia);
    return list;
  }

  updateField(event) {
    const ocorrencia = { ...this.state.ocorrencia }
    let isEmpty = true;
    console.log(event.target.value);
    ocorrencia[event.target.name] = event.target.value;
    if (ocorrencia.aluno != "" && ocorrencia.name != "")
      isEmpty = false;
    this.setState({ ocorrencia, isEmpty });
  }

  displayImg(event) {
    let img = document.getElementById("imagem");
    img.src = URL.createObjectURL(event.target.files[0]);
  }

  fileSelect(event) {
    const ocorrencia = { ... this.state.ocorrencia }
    ocorrencia[event.target.name] = event.target.files[0].name
    console.log(event.target.files[0].name);
    this.setState({ ocorrencia });
    this.displayImg(event);
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

  renderForm(lingua) {
    return (
      <form>
        <div className="form">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for="name">{linguaInformation[`labelOccurrence-${lingua}`]}</label>
                <input type="text" className="form-control" name="name" 
                        placeholder={linguaInformation[`holderOccurrenceDesc-${lingua}`]}
                        onChange={e => this.updateField(e)} value={this.state.ocorrencia.name} required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label for="aluno">{linguaInformation[`labelstudent-${lingua}`]}</label>
                <select type="select" className="form-control" name="aluno" onChange={e => this.updateField(e)}>
                  <option selected disabled>{linguaInformation[`selectChoseStudent-${lingua}`]}</option>
                  {this.renderOptions()}
                </select>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="from-group">
                <label for="foto"> {linguaInformation[`labelphoto-${lingua}`]}:</label>
                <input type="file" name="foto" accept="image/*" onChange={e => this.fileSelect(e)} />
                <img id="imagem" width="100" />
              </div>
            </div>
          </div>
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

  renderTable(lingua) {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>{linguaInformation[`labelOccurrence-${lingua}`]}</th>
            <th>{linguaInformation[`labelstudent-${lingua}`]}</th>
            <th>{linguaInformation[`table-image-${lingua}`]}</th>
            <th>{linguaInformation[`table-alter-${lingua}`]}/{linguaInformation[`table-remove-${lingua}`]}</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  render() {
    const { lingua } = this.state;

		headerProps.title =  linguaInformation['occurrences-title-' + lingua]
    headerProps.subtitle =  linguaInformation['occurrences-subtitle-' + lingua]
    
    return (
      <Main {...headerProps}>
        {this.renderForm(lingua)}
        {this.renderTable(lingua)}
      </Main>
    )
  }

}
