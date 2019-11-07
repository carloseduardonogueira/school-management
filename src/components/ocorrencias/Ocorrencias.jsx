import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
    icon: 'users',
    title: 'Ocorrências',
    subtitle: 'Cadastrar nova Ocorrência'
  };

  const baseUrl = 'http://localhost:3001/ocorrencias';
  
  export default class Ocorrência extends Component{

   renderForm(){
       return(
           <form>
               <div className="form">
                   <div className="row">
                       <div className="col-12 col-md-6">
                           <div className="form-group">
                                <label for = "ocorrencia">Ocorrência:</label>
                                <input type = "text" className = "form-control" name = "ocorrencia" placeholder = "digite a ocorrência"/>
                            </div>
                       </div> 
                       <div className = "col-12 col-md-6">
                           <div className = "form-group">
                               <label for = "aluno">Aluno</label>
                               <select type = "select" className = "form-control"  name = "aluno">
                               <option selected disabled>Selecione o aluno</option>
                               </select>
                           </div>
                       </div>
                   </div>
                   <hr />
                   <div className = "row">
                       <div className = "col-12 col-md-6">
                           <div className = "from-group">
                               <label for = "foto"> Subir foto da Ocorrência:</label>
                               <input type = "file" name = "foto" accept="image/*"/>
                           </div>
                       </div>
                   </div>
                   <div className="row">

            <div className="col-12 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                //onClick={e => this.save(e)}
                //disabled={this.state.isEmpty}
              >
                Salvar
              </button>

              <button
                className="btn btn-secondary ml-2"
                //onClick={e => this.clear(e)}
              >
                Cancelar
              </button>
            </div>
            <div className="col-12 d-flex justify-content-end">
              {
                //this.state.isEmpty && (
                  //<div class="alert alert-danger" role="alert">
                    //Você deve preencher os dados!
                  //</div>
                //)
              }
            </ div>
            <div className="col-12 d-flex justify-content-end">
              {
                /*this.state.saved && (
                  <div class="alert alert-success" role="alert">
                    Ocorrência inserida com sucesso!
                  </div>
                )*/
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