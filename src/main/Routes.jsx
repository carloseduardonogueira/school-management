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

const wrapperLayout = (component) => <Layout>{component}</Layout>

export default props =>
    <Switch>
        <Route exact path='/' component={Initialize} />
        <Route exact path='/login' component={Login} />

        <Route exact path='/home' component={() => wrapperLayout(<Home />)} />
        <Route exact path='/escolas' component={() => wrapperLayout(<School />)} />
        <Route exact path='/professores' component={() => wrapperLayout(<Professor />)} />
        <Route exact path='/administradores' component={()=> wrapperLayout(<Administrador />)} />
        <Route exact path='/alunos' component={()=> wrapperLayout(<Aluno/>)}/>
        <Route exact path='/diretores' component={()=> wrapperLayout(<Diretor/>)} />
        <Route exact path='/materias' component={()=> wrapperLayout(<Materia/>)}/>
        

        <Redirect from='*' to='/' />
    </Switch>