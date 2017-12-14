import { map, pick, flatten, compose, pluck, update } from "ramda"

const fields = [ "level", "title", "_id" ]
const pickFields = map(pick(fields))
const rename = map(obj => ({ _id: obj._id, level: obj.level, title: obj.title }))

// Prevent loading on sever
const isBrowser = typeof window !== "undefined"
const getFlatDataFromTree = isBrowser ? require("react-sortable-tree").getFlatDataFromTree : undefined

export function updateSectionTree({ path, treeData, treeIndex }) {
  // React-Sortable-Tree needs the window object which only exists in the browser

  // Obtain a flattened tree with only the properties of interest
  const flattenedTree = compose(rename, pickFields, pluck("node"))(getFlatDataFromTree({ treeData, getNodeKey: () => null }))
  const leveledTree = update(treeIndex, { ...flattenedTree[treeIndex], level: path.length })(flattenedTree)

  // Flatten DocumentElementsArray
  const newTree = []
  leveledTree.forEach((el) => {
    newTree.push(pick(fields, el))
    if (el.children) {
      newTree.push(el.children)
    }
  })

  // Cleanup
  const newElements = compose(pickFields, flatten)(newTree)

  // We also return an array of the parent sections so that we can
  // expand them after dropping the section
  const parentSections = []
  for (const i of path) {
    parentSections.push(flattenedTree[i])
  }

  // Return the reorderd elements and the section levels
  return { sections: newElements, parentSections }
}
