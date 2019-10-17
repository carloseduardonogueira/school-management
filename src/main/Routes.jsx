import React from "react";
import { Switch, Route, Redirect } from 'react-router';

import Layout from './wrapper/Layout';

import Initialize from './intialize/Initialize';

import Home from '../components/home/Home';
import Login from '../components/login/Login';
import School from '../components/school/School';
import Professor from '../components/professor/Professor';

const wrapperLayout = (component) => <Layout>{component}</Layout>

export default props =>
    <Switch>
        <Route exact path='/' component={Initialize} />
        <Route exact path='/login' component={Login} />

        <Route exact path='/home' component={() => wrapperLayout(<Home />)} />
        <Route exact path='/escolas' component={() => wrapperLayout(<School />)} />
        <Route exacy path='/professores' component={() => wrapperLayout(<Professor />)} />

        <Redirect from='*' to='/' />
    </Switch>