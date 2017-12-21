import React from "react"
import PropTypes from "prop-types"
import client from "../graphql"
import { URL } from "../config"

const LogoutForm = ({ refetch }) => {
  const handleClick = () => {
    fetch(`https://${URL}/auth/sign-out`, {
      method: "get",
      credentials: "include",
      mode: "cors",
    }).then(response => response.json()).then((json) => {
      if (json.status === 200) {
        client.resetStore()
        refetch()
      }
    }).catch((error) => {
      console.log(error) // eslint-disable-line
    })
  }
  return (
    <p onClick={() => handleClick()} className="primary btn">Logout</p> // eslint-disable-line
  )
}

LogoutForm.propTypes = {
  refetch: PropTypes.func.isRequired,
}

export default LogoutForm
