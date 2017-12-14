import React from "react"
import PropTypes from "prop-types"
import { HotKeys } from "react-hotkeys"
import { pathOr, map, flatten, pluck, propOr } from "ramda"
import _JSXStyle from "styled-jsx/style"
import documentToStructure from "../../../lib/helpers/documentToStructure"
import { updateSectionTree } from "../../../lib/helpers/updateSectionTree"
import DocumentTreeNode from "../DocumentTreeNode/DocumentTreeNode"
import extractExpandMappingStructure from "../../../lib/helpers/extractExpandMappingStructure"
import { stylesheet, classNames } from "./DocumentTreeStructure.css"
import { handleUpKey, handleDownKey, handleLeftKey, handleRightKey, handleEnter, handleEscape } from "./handleKeys"
// import scrollTo from "Documents/lib/helpers/smoothScroll"

// Prevent loading on server
const isBrowser = typeof window !== "undefined"
const SortableTreeWithoutDndContext = isBrowser ? require("react-sortable-tree").SortableTreeWithoutDndContext : undefined

function expandTree(tree = [], expandStructure) {
  const ids = map(node => [ node.id, ...pluck("id", propOr([], "children", node)) ], tree)
  for (const i of flatten(ids)) { expandStructure[i] = true } // eslint-disable-line
  return expandStructure
}

function customSearchTree({ node, searchQuery }) {
  if (!searchQuery) return false
  const searchRegex = new RegExp(searchQuery, "i")
  const text = node.title
  return searchRegex.test(text)
}

const keyMap = {
  handleUpKey: "up",
  handleDownKey: "down",
  handleLeftKey: "left",
  handleRightKey: "right",
  handleEnter: "enter",
  handleEscape: "escape",
}

class DocumentTreeStructure extends React.Component {
  constructor(props) {
    super(props)
    const tree = props.tree || documentToStructure(pathOr([], [ "document", "data", "sections" ], this.props), {})
    const expandStructure = expandTree(tree, extractExpandMappingStructure({ children: tree }, {}))
    this.state = {
      tree: documentToStructure(pathOr([], [ "document", "data", "sections" ], this.props), expandStructure),
      expandStructure,
    }

    this.updateSectionTitle = this.updateSectionTitle.bind(this)
    this.renderTree = this.renderTree.bind(this)

    this.handlers = {
      handleUpKey: () => handleUpKey(this.state.tree, this.props.selectedSection, this.props.selectSection),
      handleDownKey: () => handleDownKey(this.state.tree, this.props.selectedSection, this.props.selectSection),
      handleRightKey: () => handleRightKey(this.state.tree, this.state.expandStructure, this.setState, this.handleDownKey, this.props.selectedSection, this.props.document.data.sections),
      handleLeftKey: () => handleLeftKey(this.state.tree, this.state.expandStructure, this.setState, this.handleUpKey, this.props.selectedSection, this.props.document.data.sections),
      handleEnter: () => handleEnter(this.props.editedSection, this.props.selectedSection, this.props.editSection),
      handleEscape: () => handleEscape(this.props.selectSection),
    }
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ expandStructure: expandTree(this.state.tree, this.state.expandStructure) })
    }, 500)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tree: documentToStructure(pathOr([], [ "document", "data", "sections" ], nextProps), this.state.expandStructure) })
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  // Updates the section title
  updateSectionTitle(node, value) {
    const iframe = document.getElementsByTagName("iframe")[0].contentWindow
    iframe.postMessage({ type: "updateSection", node, value }, window.location.origin)
    // After updating, switch the edited section to view mode
    this.props.editSection({ value: null })
    // Because we have a div with tabIndex=0, we can focus the
    // section again to continue using the up and down keys
    setTimeout(() => this.component.focus(), 900)
  }

  // Calls the mutation for changes in the document section tree
  handleTreeUpdates({ path, treeData, treeIndex }) {
    const { document: doc } = this.props
    const { expandStructure } = this.state
    const { sections, parentSections } = updateSectionTree({
      path, treeData, treeIndex, elements: doc.data.sections,
    })

    // Send data to editor iframe
    const iframe = document.getElementsByTagName("iframe")[0].contentWindow
    iframe.postMessage({ type: "updateStructure", sections }, window.location.origin)

    // Expand the parent sections where the dragged section was dropped into
    for (const i of parentSections) { // eslint-disable-line
      expandStructure[i._id] = true
    }
    this.setState({ expandStructure })
  }

  // Updates the expandStructure state after a section is expanded or collapsed
  // Also, selects the clicked section
  toggleNode(data) {
    const { expandStructure } = this.state
    expandStructure[data.node._id] = data.expanded
    this.setState({ expandStructure })
    this.props.selectSection({ value: data.node._id })
  }

  renderTree() {
    const { document, disableTreeDrag, additionalCounter } = this.props
    return (
      <SortableTreeWithoutDndContext
        className={`${classNames.tree}`}
        generateNodeProps={() => ({
          additionalCounter,
          disableTreeDrag,
          doc: document,
          editable: this.props.editable,
          editedSection: this.props.editedSection,
          editSection: this.props.editSection,
          KEY_CTRL: this.props.KEY_CTRL,
          selectedSection: this.props.selectedSection,
          selectSection: this.props.selectSection,
          updateSectionTitle: this.updateSectionTitle,
        })}
        maxDepth={3}
        nodeContentRenderer={DocumentTreeNode}
        onChange={tree => this.setState({ tree })}
        onMoveNode={data => this.handleTreeUpdates(data)}
        onVisibilityToggle={data => this.toggleNode(data)}
        rowHeight={24}
        scaffoldBlockPxWidth={16}
        searchMethod={customSearchTree}
        searchQuery={this.props.searchString}
        treeData={this.state.tree}
      />
    )
  }

  render() {
    return (
      <HotKeys
        handlers={this.handlers}
        id={this.props.id}
        keyMap={keyMap}
        style={{
          minWidth: "100%", minHeight: "100%", overflowY: "scroll", overflowX: "hidden",
        }}
      >
        <div id="hotkeys" ref={i => this.component = i} tabIndex={0} />
        {this.renderTree()}
        <_JSXStyle styleId="DocumentTreeStructure" css={stylesheet} />
      </HotKeys>)
  }
}

DocumentTreeStructure.displayName = "DocumentTreeStructure"
DocumentTreeStructure.propTypes = {
  additionalCounter: PropTypes.bool,
  disableTreeDrag: PropTypes.bool,
  document: PropTypes.shape({
    _id: PropTypes.string,
    data: PropTypes.shape({
      sections: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        level: PropTypes.number,
      })),
    }),
  }).isRequired,
  editable: PropTypes.bool,
  editedSection: PropTypes.string,
  editSection: PropTypes.func.isRequired,
  id: PropTypes.string,
  KEY_CTRL: PropTypes.bool,
  searchString: PropTypes.string,
  selectedSection: PropTypes.arrayOf(PropTypes.string),
  selectSection: PropTypes.func.isRequired,
  tree: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    level: PropTypes.number,
    title: PropTypes.string,
    expanded: PropTypes.bool,
    parent: PropTypes.string,
  })),
}

DocumentTreeStructure.defaultProps = {
  additionalCounter: false,
  disableTreeDrag: false,
  editable: false,
  editedSection: "",
  id: "",
  KEY_CTRL: false,
  selectedSection: [],
  searchString: "",
  tree: null,
}

export default DocumentTreeStructure
