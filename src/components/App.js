import React from "react"
import PropTypes from "prop-types"
import { pathOr } from "ramda"
import { graphql } from "react-apollo"
import QUERY_LOGGED_IN from "../graphql/query_user"
import LoginForm from "./LoginForm"
import History from "./History"
import ImportContainer from "./ImportContainer"

function getData() {
  return new Promise((resolve, reject) => chrome.tabs.query(
    { active: true },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id, { method: "getSelection" },
        (response) => {
          const data = {
            selection: response.data,
            url: tabs[0].url,
          }
          resolve(data)
        }
      )
    }
  ))
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selection: null }
  }

  componentWillMount() {
    getData().then((res) => {
      this.setState({ selection: res.selection, url: res.url })
    })
  }

  render() {
    const { data } = this.props
    const currentUserId = pathOr(undefined, [ "currentUser", "_id" ], data)
    if (currentUserId) {
      if (this.state.selection && this.state.selection.length > 0) {
        return <ImportContainer selection={this.state.selection} url={this.state.url} />
      }
      return <History refetch={data.refetch} user={data.currentUser} />
    }
    return (
      <LoginForm refetch={data.refetch} />
    )
  }
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
