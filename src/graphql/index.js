import { ApolloClient, createNetworkInterface } from "react-apollo"
import { SubscriptionClient, addGraphQLSubscriptions } from "subscriptions-transport-ws"
import { URL } from "../config"

const networkInterface = createNetworkInterface({
  uri: `https://${URL}/graphql`,
  opts: {
    credentials: "include",
  },
  batchInterval: 100,
})

const wsClient = new SubscriptionClient(`wss://${URL}/subscriptions`, {
  reconnect: true,
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
})

export default client
