import React from "react"
import PropTypes from "prop-types"
import { Button, Form, Header, Input, Message } from "semantic-ui-react"
import _JSXStyle from "styled-jsx/style"
import { stylesheet, classNames } from "./AccountLoginPassword.css"

/**
 * Password Login Form
* @prop login   {Func}    Login function | ({ username, password })
* @prop loading {Bool}    Show loading icon
* @prop error   {Bool}    Show login error
* @prop message {String}  Login response message
* @extends React
*/
class AccountLoginPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = { username: "", password: "" }
    this.login = this.login.bind(this)
  }

  componentDidMount() {
    this.focus = setTimeout(() => {
      this.username && this.username.focus()
    }, 500)
    // Router.prefetch("/project")
  }

  componentWillUnmount() {
    clearTimeout(this.focus)
  }

  login(event) {
    event.preventDefault()
    event.stopPropagation()

    this.props.login({ username: this.state.username, password: this.state.password })
  }

  render() {
    const { loading } = this.props
    const error = this.props.error && this.props.message

    return (
      <Form className={classNames.form} onSubmit={this.login} >
        <Header as="h1">Draaft Login</Header>
        { error
          ? <Message className="error-message" floating negative>{error}</Message>
          : false }

        <Form.Field className="input-username">
          <label>Username</label>
          <Input className={classNames.field} focus icon="user" iconPosition="left" onChange={(ev, { value }) => this.setState({ username: value })} placeholder="Enter your username..." ref={i => this.username = i} />
        </Form.Field>
        <Form.Field className="input-password" control={Input} icon="lock" iconPosition="left" label="Password" onChange={(ev, { value }) => this.setState({ password: value })} placeholder="********" type="password" />
        <Form.Field className="button-login" content="Login" control={Button} fluid icon="sign in" loading={loading} onClick={this.login} primary type="submit" />
        <_JSXStyle styleId="AccountLogin" css={stylesheet} />
      </Form>
    )
  }
}

AccountLoginPassword.propTypes = {
  login: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  message: PropTypes.any,
  error: PropTypes.bool,
}

AccountLoginPassword.defaultProps = {
  loading: false,
  message: null,
  error: false,
}
export default AccountLoginPassword
