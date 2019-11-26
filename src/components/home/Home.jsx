import React from 'react';
import Main from '../template/Main';

import linguaInformation from '../../services/lingua';

const InitialState = {
  lingua: (window && window.lingua) || 'PT-BR',
}

export default class Materia extends React.Component {
  state = { ...InitialState }

  selectLingua(event) {
    window.lingua = event.target.value;
    this.setState({ lingua: event.target.value });
  }

  render() {
    const { lingua } = this.state;

    return (
      <Main
        icon="home"
        title="Home"
        subtitle="Sistema de Gestão Escolar"
      >
      <div className="display-4">
        {linguaInformation[`home-title-${lingua}`]}
      </div>
      <hr />
      <select
        type='select'
        className='form-control'
        name='professor'
        value={this.state.lingua}
        onChange={e => this.selectLingua(e)}
      >
        <option value='' selected disabled>Selecione a linguagem</option>
        <option value='PT'>PT</option>
        <option value='PT-BR'>PT-BR</option>
        <option value='EN'>EN</option>
      </select>

      <hr />
      <p className="mb-0">
        Sistema de gerenciamento escolar desenvolvido para a disciplina Gestão de Projetos B!
      </p>
    </Main>   
    )
  }
}
