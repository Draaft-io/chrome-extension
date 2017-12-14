import gql from "graphql-tag"
import { graphql } from "react-apollo"

export const setShowImportSuccessScreen = gql`
  mutation setShowImportSuccessScreen(
    $value: Boolean
  ) {
    setShowImportSuccessScreen(
      value: $value
    ) {
      _id
    }
  }
`

export const setShowImportSuccessScreenMutation = graphql(setShowImportSuccessScreen, {
  props: ({ mutate }) => ({
    setShowImportSuccessScreen: ({ value }) => mutate({
      variables: { value },
    }),
  }),
})
