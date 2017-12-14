import { forEach } from "ramda"

export default function extractExpandMappingStructure(structure, assocArray) {
  let mappingStructure = assocArray
  if (structure && structure.children) {
    forEach((node) => {
      mappingStructure[node._id] = node.expanded || true
      if (node.children !== undefined) {
        if (node.children.length !== 0) {
          mappingStructure = extractExpandMappingStructure(node, mappingStructure)
        }
      }
    }, structure.children)
  }
  return mappingStructure
}
