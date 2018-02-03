import React from "react"
import PropTypes from "prop-types"
import { DropTarget } from "react-dnd"
import _JSXStyle from "styled-jsx/style"
import { stylesheet, classNames } from "./DocumentTreeNodeDnD.css"

class TreeDnDBox extends React.Component {
  render() {
    const { canDrop, isOver, connectDropTarget } = this.props
    const isActive = canDrop && isOver
    const target = (
      <div className={`drop-box ${classNames.box} ${isActive ? `${classNames.isActive} drop-box-active` : ""} ${!isActive && canDrop ? `${classNames.canDrop} drop-box-can-drop` : ""}`}>
        <div className={`${classNames.bin}`}>
          {isActive
            ? null
            : "Drag a box here"
          }
        </div>
        <_JSXStyle styleId="TreeDnDBox" css={stylesheet} />
      </div>
    )
    return connectDropTarget(target)
  }
}

const boxTarget = {
  drop(props) {
    return { sectionId: props.sectionId, documentId: props.documentId, type: "dndToTree" }
  },
}

TreeDnDBox.propTypes = {
  canDrop: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
}

export default DropTarget("CARD", boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(TreeDnDBox)
