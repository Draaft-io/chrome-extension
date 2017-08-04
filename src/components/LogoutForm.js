import React from "react"
import client from "../graphql"
import { URL } from "../config"

const LogoutForm = () => {
  const handleClick = () => {
    fetch(`https://${URL}/auth/sign-out`, {
      method: "get",
      credentials: "include",
      mode: "cors",
    }).then(response => response.json()).then((json) => {
      if (json.message === "logged out") {
        client.resetStore()
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  return (
    <p onClick={handleClick} className="primary btn">Logout</p>
  )
}

export default LogoutForm
