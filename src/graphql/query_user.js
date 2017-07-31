import { gql, graphql  } from 'react-apollo'

export default gql`query {
  currentUser {
    _id
    username
    components(limit: 10) {
      _id
      title
      data {
        content
      }
      documents {
        _id
        title
      }
      project {
        _id
        title
      }
    }
  }
}`
