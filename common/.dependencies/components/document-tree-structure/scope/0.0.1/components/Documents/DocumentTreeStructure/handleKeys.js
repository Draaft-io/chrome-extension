import { assoc, findIndex, head, last, propEq, propOr } from "ramda"
import { flattenVisibleTree } from "../../../lib/helpers/flattenVisibleTree"
import documentToStructure from "../../../lib/helpers/documentToStructure"
import { getNodeId } from "../../../lib/helpers/getNodeId"

// Pressing the UP key when a section is selected
export function handleUpKey(tree, selectedSection, selectSection) {
  const flattenedTree = flattenVisibleTree(tree)
  const cursorIndex = findIndex(propEq("_id", last(selectedSection)))(flattenedTree)
  const prevInstanceId = propOr(null, "_id")(flattenedTree[cursorIndex - 1] || head(flattenedTree))
  selectSection({ value: prevInstanceId })
}

// Pressing the DOWN key when a section is selected
export function handleDownKey(tree, selectedSection, selectSection) {
  const flattenedTree = flattenVisibleTree(tree)
  const cursorIndex = findIndex(propEq("_id", last(selectedSection)))(flattenedTree)
  const nextInstanceId = propOr(null, "_id")(flattenedTree[cursorIndex + 1] || last(flattenedTree))
  selectSection({ value: nextInstanceId })
}

// Pressing the RIGHT key when a section is selected
export function handleRightKey(tree, expandStructure, setState, handleDown, selectedSection, sections) {
  const nodeId = getNodeId({ tree, selectedSection })
  if (expandStructure[nodeId] === true) handleDown()
  const newExpandStructure = assoc(nodeId, true, expandStructure)
  setState({ tree: documentToStructure(sections, newExpandStructure), expandStructure: newExpandStructure })
}

// Pressing the LEFT key when a section is selected
export function handleLeftKey(tree, expandStructure, setState, handleUp, selectedSection, sections) {
  const nodeId = getNodeId({ tree, selectedSection })
  if (expandStructure[nodeId] === false) handleUp()
  const newExpandStructure = assoc(nodeId, false, expandStructure)
  setState({ tree: documentToStructure(sections, newExpandStructure), expandStructure: newExpandStructure })
}

// Make section editable on ENTER
export function handleEnter(editedSection, selectedSection, editSection) {
  if (editedSection !== last(selectedSection)) {
    editSection({ value: last(selectedSection) })
  }
}

export function handleEscape(selectSection) {
  selectSection({ value: null })
}
