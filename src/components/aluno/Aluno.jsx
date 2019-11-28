import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import CPF from 'cpf-check';
import { compileFunction } from 'vm';
import linguaInformation from '../../services/lingua';

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
		birthdate: '',
		name_resp: '',
		email_resp: '',
		password_resp: ''
	},
	list: [],
	isInvalidPhone: true,
	isInvalidCPF: true,
	isInvalidEmail: true,
	isInvalidEmail2: true,
	isInvalidDate: true,
	saved: false,
	isEmpty: true,
	isInvalid: true,
	lingua :(window && window.lingua) || 'PT-BR'
}

export default class Aluno extends Component {

	state = { ...initialState }

	componentDidMount(){
    this.setState({ lingua: window.lingua });
  }

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

	// remove(aluno){
	// 	axios.delete(`${baseUrl}/${aluno.id}`).then(res => {
	// 		const list = this.state.list.filter(a => a !== aluno)
	// 		this.setState({ list })
	// 	})
	// }

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
		const regrasTelefone = /^\+\d{2}?\s*\(\d{2}\)\s*\d{4,5}\-?\d{4}$/g;
		const regrasCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g;
		const regrasEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9\-]+\.[a-z]+(\.[a-z]+)?$/g;
		const regrasEmail2 = /^[a-zA-Z0-9.]+@[a-zA-Z0-9\-]+\.[a-z]+(\.[a-z]+)?$/g;
		let today = new Date().toISOString().slice(0, 10)

		aluno[event.target.name] = event.target.value;
		this.setState({ aluno });

		let isInvalidPhone = false;
		let isInvalidCPF = false;
		let isInvalidEmail = false;
		let isInvalidEmail2 = false;
		let isInvalidDate = false;
		let isEmpty = false;
		let isInvalid = true;

		// Adicionar as validações aqui!

		for (let key in aluno) {

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
			if (key === 'birthdate') {
				if (today < aluno[key]) {
					isInvalidDate = true;
				}
			};
			if (key === 'email') {
				if (!regrasEmail.test(aluno[key])) {
					isInvalidEmail = true;
				}
			};
			if (key === 'email_resp') {
				if (!regrasEmail2.test(aluno[key])) {
					isInvalidEmail2 = true;
				}
			}
		};
		if (!isInvalidCPF && !isInvalidEmail  && !isInvalidEmail2 && !isInvalidPhone && !isInvalidDate && !isEmpty) {
			isInvalid = false;
		}
		this.setState({ aluno, isInvalidPhone, isInvalidCPF, isInvalidEmail, isInvalidEmail2, isInvalidDate, isEmpty, isInvalid });
	}

	renderForm(lingua) {
		return (
			<form>
				<div className="form">
					<div className="row">
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for="name">{linguaInformation[`labelname-${lingua}`]}</label>
								<input type='text' className='form-control'
									name='name'
									value={this.state.aluno.name}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderName-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for="surname">{linguaInformation[`labelsurname-${lingua}`]}</label>
								<input type='text' className='form-control'
									name='surname'
									value={this.state.aluno.surname}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderSurname-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label>{linguaInformation[`labelCPF-${lingua}`]}:</label>
								{
									this.state.isInvalidCPF && (
										<div class="alert alert-danger" role="alert">
											{linguaInformation[`cpf-message-${lingua}`]}
                    </div>
									)
								}
								<input type="text" className='form-control'
									name='cpf'
									value={this.state.aluno.cpf}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderCPF-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label>Email:</label>
								{
									this.state.isInvalidEmail && (
										<div class="alert alert-danger" role="alert">
											{linguaInformation[`email-message-${lingua}`]}
                    </div>
									)
								}
								<input type='text' className='form-control'
									name='email'
									value={this.state.aluno.email}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderEmail-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for='address'>{linguaInformation[`labeladdress-${lingua}`]}</label>
								<input type="text" className='form-control'
									name='address'
									value={this.state.aluno.address}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderAddress-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label>{linguaInformation[`labelphone-${lingua}`]}</label>
								{
									this.state.isInvalidPhone && (
										<div class="alert alert-danger" role="alert">
											{linguaInformation[`telephone-message-${lingua}`]}
                    					</div>
									)
								}
								<input type='text' className='form-control'
									name='phone'
									value={this.state.aluno.phone}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderPhone-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for='birthdate'>{linguaInformation[`labelbirthdadte-${lingua}`]}</label>
								{
									this.state.isInvalidDate && (
										<div class="alert alert-danger" role="alert">
											{linguaInformation[`date-message-${lingua}`]}
                    </div>
									)
								}
								<input type="date" className='form-control'
									name='birthdate'
									value={this.state.aluno.birthdate}
									onChange={e => this.updateField(e)}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for="name_resp">{linguaInformation[`labelguardianname-${lingua}`]}</label>
								<input type='text' className='form-control'
									name='name_resp'
									value={this.state.aluno.name_resp}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderGuardianName-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label>{linguaInformation[`labelguardianemail-${lingua}`]}</label>
								{
									this.state.isInvalidEmail2 && (
										<div class="alert alert-danger" role="alert">
											{linguaInformation[`email-message-${lingua}`]}
                    </div>
									)
								}
								<input type='text' className='form-control'
									name='email_resp'
									value={this.state.aluno.email_resp}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderStudentGuardianEmail-${lingua}`]}
									required />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label for="password_resp">{linguaInformation[`labelguardianpass-${lingua}`]}</label>
								<input type='password' className='form-control'
									name='password_resp'
									value={this.state.aluno.password_resp}
									onChange={e => this.updateField(e)}
									placeholder={linguaInformation[`holderStudentGuardianPass-${lingua}`]}
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
								{linguaInformation[`buttonsave-${lingua}`]}
              </button>

							<button
								className="btn btn-secondary ml-2"
								onClick={e => this.clear(e)}>
								{linguaInformation[`buttoncancel-${lingua}`]}
              </button>
						</div>
						<div className="col-12 d-flex justify-content-end">
							{
								this.state.isInvalid && (
									<div class="alert alert-danger" role="alert">
										{linguaInformation[`save-message-${lingua}`]}
                      </div>
								)
							}
						</div>
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
						<th>{linguaInformation[`table-name-${lingua}`]}</th>
						<th>{linguaInformation[`table-surname-${lingua}`]}</th>
						<th>{linguaInformation[`labelCPF-${lingua}`]}</th>
						<th>Email</th>
						<th>{linguaInformation[`table-address-${lingua}`]}</th>
						<th>{linguaInformation[`table-telephone-${lingua}`]}</th>
						<th>{linguaInformation[`table-birthdate-${lingua}`]}</th>
						<th>{linguaInformation[`table-guardianName-${lingua}`]}</th>
						<th>{linguaInformation[`table-guardianEmail-${lingua}`]}</th>
						<th>{linguaInformation[`table-guardianPass-${lingua}`]}</th>
						<th>{linguaInformation[`table-alter-${lingua}`]}</th>
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
					<td>{aluno.email}</td>
					<td>{aluno.phone}</td>
					<td>{aluno.birthdate}</td>
					<td>{aluno.name_resp}</td>
					<td>
						<button className='btn btn-warning'
							onClick={() => this.load(aluno)}>
							<i className='fa fa-pencil'></i>
						</button>
						{/* <button className='btn btn-danger ml-2'
							onClick = {() => this.remove(aluno)}> 
							<i className='fa fa-trash'></i>
						</button> */}
					</td>
				</tr>
			)
		})
	}

	render() {
		const { lingua } = this.state;

		headerProps.title =  linguaInformation['student-title-' + lingua]
		headerProps.subtitle =  linguaInformation['student-subtitle-' + lingua]

		return (
			<Main {...headerProps}>
				{this.renderForm(lingua)}
				{this.renderTable(lingua)}
			</Main>
		)
	}
}