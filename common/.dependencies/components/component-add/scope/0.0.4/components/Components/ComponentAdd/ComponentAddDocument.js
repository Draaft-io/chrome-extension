import React from "react"
import PropTypes from "prop-types"
import { Popup, Icon, List } from "semantic-ui-react"
import _JSXStyle from "styled-jsx/style"
import { stylesheet, classNames } from "./ComponentAddDocument.css"

class ComponentAddDocument extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  render() {
    return (
      <span>
        <Popup
          content={
            <List id="list-add-document" selection>
              {this.props.remainingDocs.map((doc, index) => (
                <List.Item className="select-add-document" key={`element-view-remdoc-${doc._id}`} onClick={() => this.props.handleAddDocument(doc._id).then(() => this.setState({ open: false }))}>{doc.title}</List.Item>
              ))}
            </List>
          }
          on="click"
          onOpen={() => (this.props.remainingDocs.length > 0 ? this.setState({ open: true }) : null)}
          onClose={() => this.setState({ open: false })}
          open={this.state.open}
          position="top left"
          trigger={
            <div className="action-btn" style={{ paddingLeft: 0, float: "left" }}>
              <div>
                <Icon className={classNames.add_icon} name="add circle" />
                <div className={`text ${classNames.add_text}`} id="button-add-document">Add Document</div>
              </div>
            </div>
          }
        />
        <_JSXStyle styleId="ComponentAddDocument" css={stylesheet} />
        { this.props.restoreSelection
          ? (
            <div onClick={this.props.restoreSelection} className={`text ${classNames.add_text}`} style={{ float: "left", padding: "1rem", cursor: "pointer" }}>
              <Icon className={classNames.add_icon} name="undo" />
              Restore Selection
            </div>
          )
          : null
        }
      </span>
    )
  }
}

ComponentAddDocument.propTypes = {
  remainingDocs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
  })).isRequired,
  handleAddDocument: PropTypes.func.isRequired,
  restoreSelection: PropTypes.func,
}

ComponentAddDocument.defaultProps = {
  restoreSelection: null,
}

export default ComponentAddDocument
