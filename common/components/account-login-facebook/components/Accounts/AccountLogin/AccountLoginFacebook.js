import React from "react"
import { Button, Form } from "semantic-ui-react"

/**
* Login Form for Facebook
*/

function loginWithFacebook(event) {
  event.preventDefault()
  event.stopPropagation()
  window.location.pathname = "/auth/facebook"
}
const AccountLoginFacebook = () => (
  <Form style={{ marginTop: "1rem" }}>
    <Form.Field basic className="button-login-facebook" content="Login with Facebook" control={Button} fluid icon="facebook" onClick={loginWithFacebook} />
  </Form>
)

export default AccountLoginFacebook
