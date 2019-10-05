import React from "react";
import { Switch, Route, Redirect } from 'react-router';

import Home from '../components/home/Home';
import School from '../components/school/School';

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/escolas' component={School} />
        <Redirect from='*' to='/' />
    </Switch>