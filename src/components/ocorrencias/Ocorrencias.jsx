import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';
import Materia from '../materias/Materias';

const headerProps = {
    icon: 'users',
    title: 'Ocorrências',
    subtitle: 'Cadastrar nova Ocorrência'
  };

  const baseUrl = 'http://localhost:3001/ocorrencias';
  const InitialState = {
    ocorrencia: { name:'' , aluno:' ', imagem: null},
    alunos:[],
    list:[],
    isInvalid : false,
    saved : false,
    isEmpty : true
  }
  
  export default class Ocorrência extends Component{

    state = { ...InitialState }

    componentWillMount(){
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

    updateField(event){
      const ocorrencia = { ...this.state.ocorrencia }
      ocorrencia[event.target.name] = event.target.value;
      let isEmpty = false;
      if(ocorrencia.name === '' || ocorrencia.aluno === '' ) 
      isEmpty = true;
      this.setState({ocorrencia, isEmpty});
    }

    fileSelect(event){
      const ocorrencia = {... this.state.ocorrencia}
      ocorrencia[event.target.name] = event.target.files[0];
      console.log(ocorrencia[event.target.name]);
      let isEmpty = false;
      if(ocorrencia.imagem == null)
      isEmpty = true;
      this.setState({ocorrencia, isEmpty})
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
            <td>{ocorrencia.imagem}</td>
            <td>
              <button className='btn btn-warning'
                onClick = {() => this.load(ocorrencia)}> 
                <i className='fa fa-pencil'></i>
              </button>
              {/* <button className='btn btn-danger ml-2'
                onClick = {() => this.remove(ocorrencia)}> 
                <i className='fa fa-trash'></i>
              </button> */}
            </td>
          </tr>
        )
      })
    }

   renderForm(){
       return(
           <form>
               <div className="form">
                   <div className="row">
                       <div className="col-12 col-md-6">
                           <div className="form-group">
                                <label for = "ocorrencia">Ocorrência:</label>
                                <input type = "text" className = "form-control" name = "ocorrencia" placeholder = "digite a ocorrência" onChange = { e => this.updateField(e) }/>
                            </div>
                       </div> 
                       <div className = "col-12 col-md-6">
                           <div className = "form-group">
                               <label for = "aluno">Aluno</label>
                               <select type = "select" className = "form-control"  name = "aluno" onChange = {e => this.updateField(e)}>
                               <option selected disabled>Selecione o aluno</option>
                               <option>teste</option>
                               {this.renderOptions()}
                               </select>
                           </div>
                       </div>
                   </div>
                   <hr />
                   <div className = "row">
                       <div className = "col-12 col-md-6">
                           <div className = "from-group">
                               <label for = "foto"> Subir foto da Ocorrência:</label>
                               <input type = "file" name = "foto" accept="image/*" onChange = {e => this.fileSelect(e)}/>
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
                    Ocorrência inserida com sucesso!
                  </div>
                )
              }
            </div>
          </div>
               </div>
           </form>
       )
   }

   renderTable(){
       return(
           <table className = "table mt-4">
               <thead>
                   <tr>
                       <th>Ocorrência</th>
                       <th>Aluno</th>
                       <th>foto</th>
                   </tr>
               </thead>
               <tbody>
               {this.renderRows()}
               </tbody>
           </table>
       )
   }

    render(){
        return(
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }


  }