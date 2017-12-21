import React from "react"
import ReactDOM from "react-dom"
import { ApolloProvider } from "react-apollo"
import client from "./graphql"
import App from "./components/App"

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.error) {
      return (
        <p>{this.state.errorInfo}</p>
      )
    }
    return (
      <ApolloProvider client={client}>
        <div id="app-container">
          <App />
        </div>
      </ApolloProvider>
    )
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById("root")
)
