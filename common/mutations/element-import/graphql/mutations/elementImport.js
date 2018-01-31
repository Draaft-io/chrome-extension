import gql from "graphql-tag"
import { graphql } from "react-apollo"
import { assocPath, contains, compose, filter, propEq, prop, map, pluck, pathOr } from "ramda"


export const elementImport = gql`
  mutation elementImport(
    $title: String
    $projectId: String!
    $selectionArray: [ImportSections]
    $url: String
    $text: String!
    $tags: [String]
  ) {
    elementImport(
      title: $title
      projectId: $projectId
      selectionArray: $selectionArray
      url: $url
      text: $text
      tags: $tags
    ) {
      _id
      data {
        content
        rotation
        plainText
      }
      description
      format
      global
      image {
        _id
        url
      }
      imageId
      level
      pages
      persons {
        creator {
          _id
          username
          email { address }
        }
        maintainers {
          _id
          username
        }
        authors {
          _id
        }
        guests {
          _id
        }
      }
      source {
        _id
        bibData {
          url
        }
      }
      title
      tags { _id title }
      type
      url
    }
  }
`

export const elementImportMutation = graphql(elementImport, {
  props: ({ mutate }) => ({
    elementImport: ({ title, projectId, selectionArray, url, text, tags }) => mutate({
      variables: { title, projectId, selectionArray, url, text, tags },
      updateQueries: {
        currentUser: (previousQueryResult, { mutationResult }) => {
          const docIds = pluck("documentId", selectionArray)
          const project = pathOr(null, [ "currentUser", "project" ])(previousQueryResult)
          const component = pathOr(null, [ "data", "elementImport" ])(mutationResult)

          if (project && component) {
            let docs

            // Update project documents
            if (docIds && docIds.length > 0) {
              docs = map((doc) => {
                // Get all sectionIds
                const sectionIds = compose(pluck("sectionId"), filter(propEq("documentId", doc._id)))(selectionArray)

                // Check whether the doc is given without a section
                const isWithoutSection = contains(undefined, sectionIds)

                // Add component to doc and sections
                const addToComponents = assocPath([ "components" ], [ ...doc.components, { _id: prop("_id", component), __typename: "Element" }])
                const addToComponentsCount = assocPath([ "componentsCount" ], doc.componentsCount + 1)
                const addToDocComponents = assocPath([ "documentComponents" ], [ ...doc.documentComponents, { _id: prop("_id", component), __typename: "Element" }])
                const addToSecComponents = assocPath([ "sectionComponents" ], [ ...doc.sectionComponents, { _id: prop("_id", component), __typename: "Element" }])
                const updateSections = sids => (d) => {
                  const sections = pathOr([], [ "data", "sections" ])(d)
                  const newSections = map((section) => {
                    if (contains(section._id, sids)) {
                      return {
                        ...section,
                        components: [ ...section.components, { _id: prop("_id", component), __typename: "Element" }],
                        componentsCount: section.componentsCount + 1,
                      }
                    }
                    return section
                  })(sections)
                  return assocPath([ "data", "sections" ], newSections)(d)
                }

                // Add component to document only
                if (contains(doc._id, docIds) && isWithoutSection) {
                  return compose(addToDocComponents, addToComponents, addToComponentsCount)(doc)
                }

                // Add component to document and section
                if (contains(doc._id, docIds) && !isWithoutSection) {
                  return compose(updateSections(sectionIds), addToSecComponents, addToComponents, addToComponentsCount)(doc)
                }

                return doc
              })(project.documents)
            }

            // Update project components
            const updateProjectDocs = assocPath([ "currentUser", "project", "documents" ], docs)
            const updateProjectComponents = assocPath([ "currentUser", "project", "components" ], [ ...project.components, component ])
            const updateProjectComponentsCount = assocPath([ "currentUser", "project", "componentsCount" ], project.componentsCount + 1)
            return compose(updateProjectDocs, updateProjectComponents, updateProjectComponentsCount)(previousQueryResult)
          }
          return previousQueryResult
        }
      },
    }),
  }),
})
