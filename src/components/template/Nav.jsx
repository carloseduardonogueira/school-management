import './Nav.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import linguaInformation from '../../services/lingua';


const initialState = {
	lingua :(window && window.lingua) || 'PT-BR'
}

export default class Nav extends Component {

	state = { ...initialState }

	componentDidMount(){
    this.setState({ lingua: window.lingua });
	}
	
  renderForm(lingua) {
		return (
			<aside className="menu-area">
				<nav className="menu">
					{/*Refatorar e criar um componente*/}
					<Link to="/">
						<i className="fa fa-home"></i> Home
								</Link>
					<Link to="/escolas">
						<i class="fa fa-university"></i> {linguaInformation[`nav-school-${lingua}`]}
								</Link>
					<Link to="/alunos">
						<i class="fa fa-users"></i> {linguaInformation[`nav-students-${lingua}`]}
								</Link>
					<Link to="/diretores">
						<i class="fa fa-users"></i> {linguaInformation[`nav-directors-${lingua}`]}
								</Link>
					<Link to="/professores">
						<i class="fa fa-users"></i> {linguaInformation[`nav-teachers-${lingua}`]}
								</Link>
					<Link to="/administradores">
						<i class="fa fa-users"></i> {linguaInformation[`nav-administrators-${lingua}`]}
								</Link>
					<Link to="/materias">
						<i class ="fa fa-book"></i> {linguaInformation[`nav-subjects-${lingua}`]}
								</Link>
						<Link to="/ocorrencias">
							<i class = "fa fa-users"></i> {linguaInformation[`nav-occurences-${lingua}`]}
						</Link>
						<Link to="/notas">
							<i class = "fa fa-star"></i> {linguaInformation[`nav-grades-${lingua}`]} 
						</Link>
				</nav>
			</aside>
    )
	}
	
	render() {
		const { lingua } = this.state;

		return (
				this.renderForm(lingua)

		)
	}
}