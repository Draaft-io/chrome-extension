import React from "react"
import PropTypes from "prop-types"
import { Header, Segment, Divider } from "semantic-ui-react"
import { URL } from "../config"
import AccountLoginPassword from "../../common/components/account-login-password"

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loading: false, message: null, error: false }
    this.login = this.login.bind(this)
  }

  login({ username, password }) {
    fetch(`https://${URL}/auth/sign-in`, {
      method: "post",
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then(response => response.json()).then((json) => {
      if (json && json.data && json.data.username && json.status === 200) {
        this.props.refetch()
      } else {
        this.setState({ loading: false, error: true, message: json.message })
      }
    }).catch((error) => {
      this.setState({ loading: false, error: true, message: error })
    })
  }

  render() {
    return (
      <div>
        <Header className="logo-header">
          <img alt="logo" src="../../images/draaft_logo_light.svg" />
        </Header>
        <Segment>
          <AccountLoginPassword loading={this.state.loading} login={this.login} message={this.state.message} error={this.state.error} />
        </Segment>
        <Divider />
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
