import arrayToTree from "array-to-tree"
import autoNumberedSections from "./autoNumberedSections"

const R = require("ramda")

export default function documentToStructure(sections, expandStructure = {}) {
  if (typeof sections === "undefined") {
    return []
  }

  const sorted = sections.map(s => ({ _id: s._id, level: s.level, title: s.title, expanded: expandStructure[s._id] }))
  if (sorted.length === 0) return []

  const getParentId = (node, nodeList) => {
    const nodeIndex = R.findIndex(R.propEq("_id", node._id))(nodeList)
    return R.compose(
      R.prop("_id"),
      R.defaultTo({}),
      R.find(n => n.level < node.level),
    )(R.drop(nodeList.length - nodeIndex, R.reverse(nodeList)))
  }

  const n = sorted.map(node => R.assoc("parent", getParentId(node, sorted), node))
  const structure = arrayToTree(n, {
    parentProperty: "parent",
    customID: "_id",
  })
  return autoNumberedSections(null, structure)
}
