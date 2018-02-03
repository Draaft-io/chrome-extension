import React from "react"
import PropTypes from "prop-types"
import { contains, head } from "ramda"
import _JSXStyle from "styled-jsx/style"
import TreeDnDBox from "./DocumentTreeNodeDnD"
import TreeInput from "./DocumentTreeInput"
import { stylesheet, classNames } from "./DocumentTreeNode.css"

// Prevent loading on server
const isBrowser = typeof window !== "undefined"
const isDescendant = isBrowser ? require("react-sortable-tree").isDescendant : undefined

class DocumentTreeNode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      editing: false,
    }

    this.handleSectionClick = this.handleSectionClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener("click", this.handleDocumentClick)
  }

  // Update the state when props change
  componentWillReceiveProps(nextProps) {
    this.setState({ active: contains(nextProps.node._id, nextProps.openedSection) })
    this.setState({ editing: nextProps.editedSection === nextProps.node._id })
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleDocumentClick)
  }

  // If clicked somewhere inside the document, then
  // save the section title and reset selected section
  handleDocumentClick(evt) {
    if (this.treeNode && !this.treeNode.contains(evt.target)) {
      if (this.state.editing) this.save()
    }
  }

  // Single clicks on a section just mark them and
  // reset any edited sections to view mode (automatically in redux action)
  handleSectionClick(ev) {
    ev.preventDefault()
    if (this.props.openedSection[0] === this.props.node._id && this.props.selectedSection[0] !== this.props.node._id) {
      // If opened section is not the one used for showing components -> reselect section and document
      this.props.selectDocument({ value: this.props.openedDocument })
      this.props.selectSection({ value: this.props.node._id, ctrl: this.props.KEY_CTRL })
    } else if (this.props.openedSection[0] === this.props.node._id && this.props.selectedSection[0] === this.props.node._id) {
      // If opened section and selected section are the current node -> unselect
      this.props.selectSection({ value: null })
      this.props.openSection({ value: null })
    } else {
      this.props.selectSection({ value: this.props.node._id, ctrl: this.props.KEY_CTRL })
      this.props.openSection({ value: this.props.node._id })
    }
  }

  // Double clicks on a section trigger the edit mode
  handleSectionDoubleClick() {
    this.props.editSection({ value: this.props.node._id })
  }

  handle(disableTreeDrag) {
    const { connectDragSource, node } = this.props
    if (disableTreeDrag) {
      return <div className={`${classNames.depth} section-number`}>{node.depth}</div>
    }
    return connectDragSource(
      (
        <div className={`${classNames.depth} section-number`}>{node.depth}</div>
      ), { dropEffect: "copy" }
    )
  }

  render() {
    const {
      additionalCounter, className, connectDragPreview, doc, draggedNode,
      isDragging, isOver, isSearchMatch, node, path, scaffoldBlockPxWidth, toggleChildrenVisibility, treeIndex,
    } = this.props

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)

    return (
      <div className={`${classNames.nodeWrapper} tree-node`}>
        <div className={`${classNames.node}`} ref={ref => this.treeNode = ref}>
          {toggleChildrenVisibility && node.children && node.children.length > 0 && (
            <button
              aria-label={node.expanded ? "Collapse" : "Expand"}
              className={node.expanded ? classNames.collapseButton : classNames.expandButton}
              onClick={(ev) => { ev.preventDefault(); toggleChildrenVisibility({ node, path, treeIndex }) }}
              style={{ left: -0.5 * scaffoldBlockPxWidth }}
            />
          )}

          <div className={`${classNames.rowWrapper} ${this.state.editing ? classNames.editing : ""}`}>
            {connectDragPreview(<div
              className={classNames.row +
                          (isDragging && isOver ? ` ${classNames.rowLandingPad}` : "") +
                          (isSearchMatch ? ` ${classNames.searchMatch}` : "") +
                          (className ? ` ${className}` : "")
              }
              style={{ opacity: isDraggedDescendant ? 0.5 : 1 }}
            >
              <div className={`${classNames.rowContents} row-content`}>
                <div className={classNames.rowTitleWrapper}>
                  <div className={classNames.rowLabel}>
                    <div className={`${classNames.rowTitle}`}>
                      {this.handle()}
                      <div className={`${classNames.title} section-title`}>
                        {this.state.editing && this.props.editable
                          ? (
                            <span key={node._id}>
                              <TreeInput
                                node={this.props.node}
                                removeSection={this.props.removeSection}
                                selectSection={this.props.selectSection}
                                updateSectionTitle={this.props.updateSectionTitle}
                              />
                            </span>
                          )
                          : (
                            <span
                              key={node._id}
                              onClick={this.handleSectionClick}
                              onDoubleClick={() => this.handleSectionDoubleClick()}
                            >
                              <div className={`section-title-content ${this.state.active ? `active ${classNames.active}` : ""}`} key={Math.random()}>{node.title} </div>
                            </span>
                          )}
                        <TreeDnDBox documentId={doc._id} sectionId={node._id} />
                      </div>
                      { additionalCounter ? <div className={classNames.additionalCounter}>{ node.tasksCount }</div> : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
          </div>
        </div>
        <_JSXStyle styleId="DocumentTreeNode" css={stylesheet} />
      </div>
    )
  }
}

DocumentTreeNode.displayName = "DocumentTreeNode"
DocumentTreeNode.propTypes = {
  additionalCounter: PropTypes.bool,
  canDrop: PropTypes.bool.isRequired,
  className: PropTypes.string,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  disableTreeDrag: PropTypes.bool,
  doc: PropTypes.object,
  draggedNode: PropTypes.object,
  editable: PropTypes.bool,
  editedSection: PropTypes.string,
  editSection: PropTypes.func,
  KEY_CTRL: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  node: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
  removeSection: PropTypes.func,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  selectedSection: PropTypes.array,
  selectSection: PropTypes.func,
  openedSection: PropTypes.array,
  openedDocument: PropTypes.string,
  selectDocument: PropTypes.func,
  openSection: PropTypes.func,
  style: PropTypes.object,
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  updateSectionTitle: PropTypes.func,
}

export default DocumentTreeNode
