import gql from "graphql-tag"
import { graphql } from "react-apollo"

export const removeElement = gql`
  mutation removeElement(
    $elementId: String!
  ) {
    removeElement(
      elementId: $elementId
    ) {
      _id
    }
  }
`

export const removeElementMutation = graphql(removeElement, {
  props: ({ mutate }) => ({
    removeElement: elementId => mutate({
      variables: { elementId },
    }),
  }),
})
