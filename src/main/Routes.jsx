import React from "react";
import { Switch, Route, Redirect } from 'react-router';

import Home from '../components/home/Home';
import School from '../components/school/School';
import Professor from '../components/professor/Professor'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/escolas' component={School} />
        <Route path='/professores' component={Professor} />
        <Redirect from='*' to='/' />
    </Switch>