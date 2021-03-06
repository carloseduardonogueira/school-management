import React from "react";
import { Switch, Route, Redirect } from 'react-router';

import Layout from './wrapper/Layout';

import Initialize from './intialize/Initialize';

import Home from '../components/home/Home';
import Login from '../components/login/Login';
import School from '../components/school/School';
import Professor from '../components/professor/Professor';
import Administrador from '../components/administrador/Administrador';
import Aluno from '../components/aluno/Aluno';
import Diretor from '../components/diretor/Diretor';
import Materia from '../components/materias/Materias';
import Grades from '../components/grades/Grades';
import Ocorrencias from '../components/ocorrencias/Ocorrencias'
import Notas from '../components/notas/Notas'

const wrapperLayout = (component) => <Layout>{component}</Layout>

export default props =>
  <Switch>
    <Route exact path='/' component={Initialize} />
    <Route exact path='/login' component={Login} />

    <Route exact path='/home' component={() => wrapperLayout(<Home />)} />
    <Route exact path='/escolas' component={() => wrapperLayout(<School />)} />
    <Route exact path='/professores' component={() => wrapperLayout(<Professor />)} />
    <Route exact path='/administradores' component={() => wrapperLayout(<Administrador />)} />
    <Route exact path='/alunos' component={() => wrapperLayout(<Aluno />)} />
    <Route exact path='/diretores' component={() => wrapperLayout(<Diretor />)} />
    <Route exact path='/materias' render={(props) => wrapperLayout(<Materia {...props} />)} />
    <Route exact path='/grades' component={(props) => wrapperLayout(<Grades materia={props.location.props} />)} />
    <Route exact path='/ocorrencias' component={() => wrapperLayout(<Ocorrencias />)} />
    <Route exact path='/notas' component={Notas} />
    <Redirect from='*' to='/' />
  </Switch>