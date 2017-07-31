import React from "react"
import PropTypes from "prop-types"
import { pathOr } from "ramda"
import { graphql } from "react-apollo"
import QUERY_LOGGED_IN from "../graphql/query_user"
import LoginForm from "./LoginForm"
import History from "./History"

const App = (props) => {
  const currentUserId = pathOr(undefined, [ "data", "currentUser", "_id" ], props)
  if (currentUserId) {
    return <History refetch={props.data.refetch} user={props.data.currentUser} />
  }
  return <LoginForm refetch={props.data.refetch} />
}

App.displayName = "App"
App.propTypes = {
  data: PropTypes.shape({
    currentUser: PropTypes.shape({
      _id: PropTypes.string,
    }),
    refetch: PropTypes.func,
  }).isRequired,
}

export default graphql(QUERY_LOGGED_IN)(App)
