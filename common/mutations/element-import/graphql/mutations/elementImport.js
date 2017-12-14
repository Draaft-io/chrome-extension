import gql from "graphql-tag"
import { graphql } from "react-apollo"

export const elementImport = gql`
  mutation elementImport(
    $title: String
    $projectId: String
    $selectionArray: [ImportSections]
    $url: String
    $text: String
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
    }
  }
`

export const elementImportMutation = graphql(elementImport, {
  props: ({ mutate }) => ({
    elementImport: ({ title, projectId, selectionArray, url, text, tags }) => mutate({
      variables: { title, projectId, selectionArray, url, text, tags },
    }),
  }),
})
