import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import CPF from 'cpf-check';
import { compileFunction } from 'vm';

const headerProps = {
	icon: 'users',
	title: 'Alunos',
	subtitle: 'Cadastrar novo aluno'
};

const baseUrl = 'http://localhost:3001/alunos'
const initialState = {
	aluno: {
		name: '',
		surname: '',
		email: '',
		cpf: '',
		address: '',
		phone: '',
		birthdate: ''
	},
	list: [],
	isInvalidPhone: true,
	isInvalidCPF: true,
	isInvalidEmail: true,
	saved: false,
	isEmpty: true,
	isInvalid: true
}

export default class Aluno extends Component {

	state = { ...initialState }

	componentWillMount() {
		axios(baseUrl)
			.then(res => {
				this.setState({ list: res.data })
			});
	}

	clear() {
		this.setState({ aluno: initialState.aluno });
	}

	load(aluno) {
		this.setState({ aluno })
	}

	remove(aluno){
		axios.delete(`${baseUrl}/${aluno.id}`).then(res => {
			const list = this.state.list.filter(a => a !== aluno)
			this.setState({ list })
		})
	}

	save() {
		const aluno = this.state.aluno
		const method = aluno.id ? 'put' : 'post'
		const url = aluno.id ? `${baseUrl}/${aluno.id}` : baseUrl
		axios[method](url, aluno)
			.then(res => {
				debugger;
				const list = this.getUpdatedList(res.data)
				this.setState({ saved: true });
				setTimeout(() => { this.setState({ aluno: initialState.aluno, list, saved: false, isInvalid: true }) }, 1000);
			})
	}

	getUpdatedList(aluno) {
		const list = this.state.list.filter(a => a.id !== aluno.id);
		list.unshift(aluno);
		return list;
	}

	updateField(event) {
		const aluno = { ...this.state.aluno };
		const regrasTelefone = /^\+?\d{2}?\s*\(\d{2}\)?\s*\d{4,5}\-?\d{4}$/g;
		const regrasCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g;
		const regrasEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9\-]+\.[a-z]+(\.[a-z]+)?$/g;


		aluno[event.target.name] = event.target.value;
		this.setState({ aluno });

		let isInvalidPhone = false;
		let isInvalidCPF = false;
		let isInvalidEmail = false;
		let isEmpty = false;
		let isInvalid = true;

		// Adicionar as validações aqui!

		for (let key in aluno) {
			debugger;

			if (aluno[key] === '') {
				isEmpty = true;
			};

			if (key === 'phone') {
				if (!regrasTelefone.test(aluno[key])) {
					isInvalidPhone = true;
				};
			};
			if (key === 'cpf') {
				if (!regrasCPF.test(aluno[key]) || !CPF.validate(aluno[key])) {
					isInvalidCPF = true;
				};
			};
			if (key === 'email') {
				if (!regrasEmail.test(aluno[key])) {
					isInvalidEmail = true;
				}
			}
		};
		if (!isInvalidCPF && !isInvalidEmail && !isInvalidPhone && !isEmpty) {
			isInvalid = false;
		} 
		this.setState({ aluno, isInvalidPhone, isInvalidCPF, isInvalidEmail, isEmpty, isInvalid});
	}

	renderForm() {
		return (
			<form>
				<div className="form">
					<div className="row">
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for="name">Nome:</label>
								<input type='text' className='form-control'
									name='name'
									value={this.state.aluno.name}
									onChange={e => this.updateField(e)}
									placeholder='Digite o nome do aluno'
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for="surname">Sobrenome:</label>
								<input type='text' className='form-control'
									name='surname'
									value={this.state.aluno.surname}
									onChange={e => this.updateField(e)}
									placeholder='Digite o sobrenome do aluno'
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label>CPF:</label>
								{
									this.state.isInvalidCPF && (
										<div class="alert alert-danger" role="alert">
											Você deve preencher os dados de CPF no padrão: '123.456.789-00'
                    </div>
									)
								}
								<input type="text" className='form-control'
									name='cpf'
									value={this.state.aluno.cpf}
									onChange={e => this.updateField(e)}
									placeholder="Digite o CPF"
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label>E-mail:</label>
								{
									this.state.isInvalidEmail && (
										<div class="alert alert-danger" role="alert">
											Você deve preencher os dados de E-mail no padrão: 'teste09@puccampinas.com'
                    </div>
									)
								}
								<input type='text' className='form-control'
									name='email'
									value={this.state.aluno.email}
									onChange={e => this.updateField(e)}
									placeholder='Digite o e-mail do aluno'
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for='address'>Endereço:</label>
								<input type="text" className='form-control'
									name='address'
									value={this.state.aluno.address}
									onChange={e => this.updateField(e)}
									placeholder="Digite o endereço do aluno"
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label>Telefone:</label>
								{
									this.state.isInvalidPhone && (
										<div class="alert alert-danger" role="alert">
											Você deve preencher os dados de telefone no padrão: '+55 (55) 23321-5454'
                    </div>
									)
								}
								<input type='text' className='form-control'
									name='phone'
									value={this.state.aluno.phone}
									onChange={e => this.updateField(e)}
									placeholder='Digite o telefone do aluno'
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for='birthdate'>Data de nascimento:</label>
								<input type="date" className='form-control'
									name='birthdate'
									value={this.state.aluno.birthdate}
									onChange={e => this.updateField(e)}
									placeholder='04/06/1998'
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
								disabled={this.state.isInvalid}>
								Salvar
              </button>

							<button
								className="btn btn-secondary ml-2"
								onClick={e => this.clear(e)}>
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
						</div>
						<div className="col-12 d-flex justify-content-end">
							{
								this.state.saved && (
									<div class="alert alert-success" role="alert">
										Aluno inserido com sucesso!
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
						<th>Sobrenome</th>
						<th>CPF</th>
						<th>E-mail</th>
						<th>Endereço</th>
						<th>Telefone</th>
						<th>Data de Nascimento</th>
						<th>Alterar/Excluir</th>
					</tr>
				</thead>
				<tbody>
					{this.renderRows()}
				</tbody>
			</table>
		)
	}

	renderRows() {
		return this.state.list.map(aluno => {
			return (
				<tr key={aluno.id}>
					<td>{aluno.name}</td>
					<td>{aluno.surname}</td>
					<td>{aluno.cpf}</td>
					<td>{aluno.email}</td>
					<td>{aluno.address}</td>
					<td>{aluno.phone}</td>
					<td>{aluno.birthdate}</td>
					<td>
						<button className='btn btn-warning'
							onClick = {() => this.load(aluno)}> 
							<i className='fa fa-pencil'></i>
						</button>
						<button className='btn btn-danger ml-2'
							onClick = {() => this.remove(aluno)}> 
							<i className='fa fa-trash'></i>
						</button>
					</td>
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