import gql from "graphql-tag"
import { graphql } from "react-apollo"
import { assocPath, pathOr, concat, reject, contains } from "ramda"

export const removeElement = gql`
  mutation removeElement(
    $elementId: String!
    $undo: Boolean
  ) {
    removeElement(
      elementId: $elementId
      undo: $undo
    ) {
      _id
      format
      type
      imageId
      level
      description
      global
      url
      title
      pages
      data {
        content
        rotation
        plainText
      }
      image {
        _id
        url
      }
      source {
        _id
        bibData {
          url
        }
      }
      persons {
        creator {
          _id
          username
          profile {
            firstname
            lastname
            __typename
          }
          services {
            google {
              googleId
              __typename
            }
            facebook {
              facebookId
              __typename
            }
            __typename
          }
          email {
            address
            __typename
          }
          __typename
        }
        maintainers {
          _id
          _id
          username
          profile {
            firstname
            lastname
            __typename
          }
          services {
            google {
              googleId
              __typename
            }
            facebook {
              facebookId
              __typename
            }
            __typename
          }
          email {
            address
            __typename
          }
          __typename
        }
        authors {
          _id
          _id
          username
          profile {
            firstname
            lastname
            __typename
          }
          services {
            google {
              googleId
              __typename
            }
            facebook {
              facebookId
              __typename
            }
            __typename
          }
          email {
            address
            __typename
          }
          __typename
        }
        guests {
          _id
          _id
          username
          profile {
            firstname
            lastname
            __typename
          }
          services {
            google {
              googleId
              __typename
            }
            facebook {
              facebookId
              __typename
            }
            __typename
          }
          email {
            address
            __typename
          }
          __typename
        }
      }
      tags {
        __typename
        _id
        title
      }
    }
  }
`

export const removeElementMutation = graphql(removeElement, {
  props: ({ mutate }) => ({
    removeElement: ({ elementId, undo = false }) => mutate({
      variables: { elementId, undo },
      updateQueries: {
        currentUser: (previousQueryResult, { mutationResult }) => {
          const project = pathOr([], [ "currentUser", "project" ], previousQueryResult)
          const res = pathOr(null, [ "data", "removeElement" ], mutationResult)
          if (project && project.components) {
            let components
            if (!undo) {
              components = reject(c => contains(c._id, elementId.split(",")))(project.components)
            } else if (undo && res) {
              components = concat(res, project.components)
            }
            return assocPath([ "currentUser", "project", "components" ], components)(previousQueryResult)
          }
          return previousQueryResult
        },
      },
    }),
  }),
})
