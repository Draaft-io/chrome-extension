import gql from "graphql-tag"

export default gql`
  query currentUser {
    currentUser {
      _id
      settings {
        showImportSuccessScreen
      }
      tags {
        _id
        title
      }
      projects {
        _id
        title
        documents {
          _id
          title
          description
          componentsCount
          components {
            _id
            title
            data {
              content
            }
          }
          documentComponents {
            _id
            __typename
          }
          sectionComponents {
            _id
            __typename
          }
          data {
            content
            sections {
              _id
              level
              title
              componentsCount
              components {
                _id
                title
                data {
                  content
                }
              }
            }
          }
          createdAt
          updatedAt
          cover {
            default_uri,
            file { _id }
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
          project {
            _id
          }
        }
      }
    }
  }
`
