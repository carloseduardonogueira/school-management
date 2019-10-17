import React from "react";
import { withRouter, Redirect } from "react-router-dom";

class Initialize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: !!localStorage.getItem("isLogged"),
    };
  }

  render() {
    if (!this.state.isLogged) {
      return (
        <Redirect to="/login" />
      );
    }

    return (
      <Redirect to={"/home"} />
    );

  }
}

export default withRouter(Initialize);
