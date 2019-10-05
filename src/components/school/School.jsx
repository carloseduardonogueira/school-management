import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
    icon: 'university',
    title: 'Escolas',
    subtitle: 'Cadastrar nova escola'
}

const baseUrl = 'http://localhost:3001/escolas';
const initialState ={
    school: {name:'', endereco:'', diretor:'', fone:''},
    list:[]
}

export default  class School extends Component {

    state = {...initialState}

    componentWillMount() {
        axios(baseUrl).then(res => {
            this.setState({ list: res.data});
        })
    }

    clear() {
        this.setState({school: initialState.school});
    }

    save() {
        const school = this.state.school    
        axios.post(baseUrl, school)
            .then(res => {
                const list = this.getUpdatedList(res.data)
                this.setState({school:initialState.school, list})
            });
    }

    getUpdatedList(school) {
        const list = this.state.list.filter(s => s.id !== school.id);
        list.unshift(school);
        return list;
    }

    updateField(event) {
        const school = {...this.state.school };
        school[event.target.name] = event.target.value;
        this.setState({ school });
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome:</label>
                            <input type='text' className='form-control'
                                name='name'
                                value={this.state.school.name}
                                onChange={e => this.updateField(e)}
                                placeholder='Digite o nome da escola' />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Endereço</label>
                            <input type="text" className='form-control'
                                name='endereco'
                                value={this.state.school.endereco}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o endereço da escola" />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone:</label>
                            <input type='text' className='form-control'
                                name='fone'
                                value={this.state.school.fone}
                                onChange={e => this.updateField(e)}
                                placeholder='Digite o telefone da escola' />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Diretor:</label>
                            <select type='select' className='form-control'
                                name='diretor'
                                value={this.state.school.diretor}
                                onChange={e => this.updateField(e)}
                                placeholder='Selecione o Diretor' />
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Diretor</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(school => {
            return (
                <tr key={school.id}>
                    <td>{school.name}</td>
                    <td>{school.endereco}</td>
                    <td>{school.fone}</td>
                    <td>{school.diretor}</td>
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