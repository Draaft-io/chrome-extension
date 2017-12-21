import React from "react"
import { Button, Form } from "semantic-ui-react"

/**
 * Login Form for Google
 */

function loginWithGoogle(event) {
  event.preventDefault()
  event.stopPropagation()
  window.location.pathname = "/auth/google"
}

const AccountLoginGoogle = () => (
  <Form style={{ marginTop: "1rem" }}>
    <Form.Field basic className="button-login-google" content="Login with Google" control={Button} fluid icon="google" onClick={loginWithGoogle} />
  </Form>
)

export default AccountLoginGoogle
