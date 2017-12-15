import { compose, head, prop, filter, propEq, last, pluck } from "ramda"

const isBrowser = typeof window !== "undefined"
const getFlatDataFromTree = isBrowser ? require("react-sortable-tree").getFlatDataFromTree : undefined

export function getNodeId({ tree, selectedSection }) {
  const flattenedTree = getFlatDataFromTree({ treeData: tree, getNodeKey: () => null })
  return compose(prop("_id"), head, filter(propEq("_id", last(selectedSection))), pluck("node"))(flattenedTree)
}
