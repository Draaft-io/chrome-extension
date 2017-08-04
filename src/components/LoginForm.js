import React from "react"
import PropTypes from "prop-types"
import { Form, Header, Segment, Divider } from "semantic-ui-react"
import { URL } from "../config"

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
    }
  }

  handleSubmit(ev) {
    ev.preventDefault()
    const { username, password } = this.state
    fetch(`https://${URL}/auth/sign-in`, {
      method: "post",
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then((json) => {
      this.props.refetch()
    })
  }

  render() {
    return (
      <div>
        <Header className="logo-header"><img src="../../images/draaft_logo_light.svg"/></Header>
        <Segment>
          <Form id="login-form" onSubmit={this.handleSubmit.bind(this)}>
            <Form.Field>
              <Form.Input type="text" onChange={(ev, { value }) => this.setState({ username: value })} placeholder="Email or username ..." value={this.state.username} />
            </Form.Field>
            <Form.Field>
              <Form.Input type="password" onChange={(ev, { value }) => this.setState({ password: value })} placeholder="Password ..." value={this.state.password} />
            </Form.Field>
            <Form.Input type="submit" style={{ display: "none" }} />
          </Form>
        </Segment>
        <Divider/>
        <Segment textAlign="center" style={{ paddingBottom: "1.5rem" }}>
          <p className="dark">ALREADY LOGGED IN?</p>
          <p className="light">Try to enable third party cookies in your browser settings</p>
        </Segment>
      </div>
    )
  }
}

LoginForm.displayName = "LoginForm"
LoginForm.propTypes = {
  refetch: PropTypes.func.isRequired,
}
