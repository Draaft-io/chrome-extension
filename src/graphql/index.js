import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { URL } from "../config"
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link"
import { RetryLink } from "apollo-link-retry"

const link = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }

  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )
})

const client = new ApolloClient({
  link: ApolloLink.from([
    link,
    new RetryLink(),
    new HttpLink({ uri: `https://${URL}/graphql`, credentials: "include" }),
  ]),
  cache: new InMemoryCache()
})

export default client
