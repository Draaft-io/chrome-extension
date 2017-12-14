import { assocPath, compose, findIndex, propEq, pathOr, update } from "ramda"

const updatePath = (path, selectedId, newItem) => (data) => {
  const docIndex = compose(findIndex(propEq("_id", selectedId)), pathOr(null, path))(data)
  const updated = compose(update(docIndex, newItem), pathOr([], path))(data)
  return assocPath(path, updated)(data)
}

export default updatePath
