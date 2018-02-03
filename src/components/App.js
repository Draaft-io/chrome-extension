import React from "react"
import PropTypes from "prop-types"
import { defaultTo, pathOr } from "ramda"
import { graphql } from "react-apollo"
import QUERY_LOGGED_IN from "../graphql/query_user"
import LoginForm from "./LoginForm"
import History from "./History"
import ImportContainer from "./ImportContainer"
import LoadingPage from "../../common/components/loading-page/"
import NetworkError from "./NetworkError"

function getData() {
  return new Promise((resolve, reject) => chrome.tabs.query(
    { active: true },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id, { method: "getSelection" },
        (response) => {
          if (response) {
            const data = {
              selection: response.data,
              url: tabs[0].url,
            }
            resolve(data)
          }
          reject()
        }
      )
    }
  ))
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selection: "", url: "", page: "importForm" }

    this.changePage = this.changePage.bind(this)
  }

  componentWillMount() {
    getData().then((res) => {
      this.setState({ selection: defaultTo("", res.selection), url: res.url })
    })
  }

  changePage(page) {
    this.setState({ page })
  }

  render() {
    const { data } = this.props
    const currentUserId = pathOr(undefined, [ "currentUser", "_id" ], data)

    // Show network error
    const networkError = pathOr(null, [ "error", "networkError" ], data)
    if (networkError) {
      return <NetworkError/>
    }

    if (data && data.loading) {
      return <LoadingPage />
    }

    if (currentUserId) {
      if (this.state.page === "importForm") {
        return <ImportContainer changePage={this.changePage} selection={this.state.selection} url={this.state.url} />
      } else if (this.state.page === "history") {
        return <History changePage={this.changePage} refetch={data.refetch} user={data.currentUser} />
      } else {
        return <p>Something went wrong</p>
      }
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
