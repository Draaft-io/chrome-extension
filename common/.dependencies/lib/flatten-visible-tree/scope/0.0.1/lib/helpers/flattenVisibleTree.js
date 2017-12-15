import flattenTree from "flatten-tree"
import { map, omit } from "ramda"

/**
 * Flattens a tree into an array while excluding invisible children
 * @param  {[Object]} tree [description]
 * @return {[Object]}      [description]
 */
export const flattenVisibleTree = (tree) => {
  const filterChildren = tr => map((node) => {
    if (node.children && !node.expanded) {
      return omit([ "children" ], node)
    } else if (node.children && node.expanded) {
      return { ...node, children: filterChildren(node.children) }
    }
    return node
  }, tr)
  const filteredTree = filterChildren(tree)
  return flattenTree(filteredTree, "children", { initNode: node => node })
}
