import gql from "graphql-tag"
import { graphql } from "react-apollo"
import { pathOr, compose, assocPath, reject, propOr, isNil, concat, difference, unnest, contains, head, map, pluck, filter, propEq } from "ramda"
import updatePath from "../../lib/helpers/updatePath"

export const updateElementTags = gql`
  mutation updateElementTags(
    $elementIds: [ String ]
    $tags: [ String ]
    $add: Boolean
  ) {
    updateElementTags(
      elementIds: $elementIds
      tags: $tags
      add: $add
    ) {
      _id
      tags {
        __typename
        _id
        title
      }
    }
  }
`

export const updateElementTagsMutation = graphql(updateElementTags, {
  props: ({ mutate }) => ({
    updateElementTags: ({ elementIds, tags, add }) => mutate({
      variables: { elementIds, tags: pluck("_id", tags), add },
      //   optimisticResponse: {
      //     __typename: "Mutation",
      //     updateElementTags: {
      //       __typename: "Element",
      //       _id: elementId,
      //       // We filter all invalid tags from the response
      //       tags: compose(reject(x => isNil(x._id)), map(tag => ({ _id: tag._id, __typename: "Tag", title: "" })))(tags),
      //     },
      //   },
      updateQueries: {
        currentUser: (previousQueryResult, { mutationResult }) => {
          const changedComponents = compose(filter(x => contains(x._id, elementIds)), pathOr([], [ "currentUser", "project", "components" ]))(previousQueryResult)
          const res = pathOr(null, [ "data", "updateElementTags" ], mutationResult)
          if (changedComponents && changedComponents.length > 0 && res && res.length > 0) {
            // 1. In case we get any invalid tags (undefined _id), we don't update the cache
            const resTags = compose(unnest, map(reject(x => isNil(x._id))), pluck("tags"))(res)
            if (resTags.length < compose(unnest, pluck("tags"))(res)) return previousQueryResult

            // 2. Update the components
            const newComponents = map((component) => {
              const newTags = compose(propOr([], "tags"), head, filter(propEq("_id", component._id)))(res)
              return { ...component, tags: newTags }
            })(changedComponents)
            const updateComponentsArray = map(c => updatePath([ "currentUser", "project", "components" ], c._id, c))(newComponents)
            const updateComponents = compose(...updateComponentsArray)

            // 3. Update the project tags array -> that is where all available tag options come from
            const existingTags = pathOr([], [ "currentUser", "project", "tags" ])(previousQueryResult)
            const newProjectTags = compose(concat(difference(resTags, existingTags)), pathOr([], [ "currentUser", "project", "tags" ]))(previousQueryResult)
            const updateProject = assocPath([ "currentUser", "project", "tags" ], newProjectTags)

            // 3. Put it all together
            return compose(updateProject, updateComponents)(previousQueryResult)
          }
          return previousQueryResult
        },
      },
    }),
  }),
})
