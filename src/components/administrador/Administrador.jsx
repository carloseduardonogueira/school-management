import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
    icon: 'university',
    title: 'Admnistrador',
    subtitle: 'Cadastrar novo administrador'
  };

  const baseUrl = 'http://localhost:3001/administradores'
  const initialState ={
      administrador:{name:'',email:''},
      list: [],
      saved: false,
      isEmpty: true,
      isInvalidEmail:true,
      isInvalid : true
  }

  export default class Administrador extends Component {
     state = {...initialState}

     componentWillMount(){
        axios(baseUrl)
          .then(res => {
              this.setState({ list: res.data})
          });
      }

      clear(){
        this.setState({ administrador: initialState.administrador });
      }

      save(){
        const administrador = this.state.administrador
        axios.post(baseUrl, administrador)
          .then(res => {
            const list = this.getUpdatedList(res.data)
            this.setState({saved: true});
            setTimeout(() => {this.setState({ administrador: initialState.administrador, list, saved: false, isInvalid: true })},1000);
          })
      }


     

      updateField(event){
        const administrador = { ...this.state.administrador };
        const regrasEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9\-]+\.[a-z]+(\.[a-z]+)?$/g;
        administrador[event.target.name] = event.target.value;
        this.setState({ administrador });
        let isInvalidEmail = false;
        let isEmpty = true;
        let isInvalid = true;

        for (let key in administrador) {
          if (Administrador[key] === '') {
            isEmpty = true;
          };
          if (key === 'email') {
            if (!regrasEmail.test(administrador[key])) {
              isInvalidEmail = true;
            };
          }
      }
      if (!isInvalidEmail){
        isInvalid = false;
    } 
    this.setState({ administrador, isInvalidEmail, isEmpty, isInvalid }); 

    }

      renderForm() {
        return(
          <form>
            <div className="form">

             <div className="row">

               <div className ="col-12 col-md-6">
               <div className="form-group">
                <label for="name">Nome:</label>
                <input type='text' className='form-control'
                  name='name'
                  value={this.state.administrador.name}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o nome do Administrador'
                  required />
              </div>
               </div>
                <div className="col-12 col-md-6">
              <div className="form-group">
                <label>E-mail:</label>
                {
                  this.state.isInvalidEmail && (
                    <div class="alert alert-danger" role="alert">
                      Você deve preencher os dados de E-mail no padrão: 'administrador09@puccampinas.com'
                    </div>
                  )
                }
                <input type='text' className='form-control'
                  name='email'
                  value={this.state.administrador.email}
                  onChange={e => this.updateField(e)}
                  placeholder='Digite o e-mail do administrador'
                  required />
              </div>
            </div>

               </div> 

               <hr />
          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={e => this.save(e)}
                disabled={this.state.isInvalid }
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
                this.state.isInvalid && (
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
                        Professor inserido com sucesso!
                    </div>  
                )
              }
            </div>
          </div>

            </div>
          </form>
        )
      }

      renderTable() {
        return (
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
             {this.renderRows()} 
            </tbody>
          </table>
        )
      }

     renderRows() {
        return this.state.list.map(administrador => {
          return (
            <tr key={administrador.id}>
              <td>{administrador.name}</td>
              <td>{administrador.email}</td>    
            </tr>
          )
        })
      }

      render() {
        return (
          <Main {...headerProps}>
            {this.renderForm()}
            {this.renderTable()}
          </Main>
        )
      }
    
    }

