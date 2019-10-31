import React,{Component} from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
    icon : 'university',
    title: 'Matérias',
    subtitle : 'Cadastrar nova matéria'
};

const baseUrl = 'http://localhost:3001/materias';
const InitialState = {
    materia : { name:'', professor:'',alunos:[]},
    professores : [],
    alunos : [],
    list: [],
    isInvalid : true,
    saved : false,
}

export default class Materia extends Component{
    state = {...InitialState}

    componentWillMount(){
        axios(baseUrl).then ( materias =>{
            axios("http://localhost:3001/professores").then(professores => {
        this.setState({professores: professores.data, list: materias.data})     
        });
        })
        axios(baseUrl).then(materias =>{
          axios("http://localhost:3001/alunos").then(alunos =>{
              this.setState({alunos:alunos.data,list : materias.data})
          });
        })
    }

    clear(){
        this.setState({state:this.initialState});
    }

    save(){
        const materia = this.state.materia;
        axios.post(baseUrl,materia).then(res =>{
            const list = this.getUpdatedList(res.data)
            this.setState({saved : true});
            setTimeout(()=>{this.setState({materia:InitialState, isInvalid:true, saved:false})})
        });
    }
    
    getUpdatedList(materia){
        const list = this.state.list.filter(m => m.id != materia.id)
        list.unshift(materia);
        return list;
    }

    updateField(event){
        console.log("chamada a função");
    }

    renderForm(){
       return(
           <form>
               <div className ="form">
                   <div className ="row">
                       <div className = "col-12 col-md-6">
                           <div className="form-group">
                               <label for = "name">Nome:</label>
                               <input type ="text" className='form-control' name = 'name' value ={this.state.materia.name}
                               onchange ={e => this.updateField(e)}
                               placeholder = "digie o nome da materia"
                               required />
                           </div>
                       </div>
                       <div className ="col-12 col-md-6">
                               <div className="form-group">
                                   <label for ="professor">Professor</label>
                                   <select type ='select' className="form-control"
                                   name = "professor" value={this.state.materia.professor}
                                   onchange={e=>this.updateField(e)}
                                   required>
                                       <option value ="" selected disabled>Selecione o Professor</option>
                                   </select>
                               </div>
                           </div>
                           <div className ="col-12 col-md-6">
                               <div className ="form-group">
                                   <label for ="alunos">Alunos</label>
                                   <select multiple className="form-control"
                                   name = "alunos"  //criar função apenas na saida
                                   onBlur={e=>this.updateField(e)}
                                   required>
                                       <option value = "teste1">teste 1</option>
                                       <option value = "teste2">teste 2</option>
                                   </select>
                               </div>
                           </div>
                   </div>
               </div>
           </form>
       )
        
    }

    render(){
        return(
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        )
    }


}