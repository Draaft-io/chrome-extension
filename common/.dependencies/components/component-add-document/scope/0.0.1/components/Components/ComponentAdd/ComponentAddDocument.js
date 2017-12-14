import React from "react"
import PropTypes from "prop-types"
import { Popup, Icon, List } from "semantic-ui-react"

class ComponentAddDocument extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  render() {
    return (
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
          <div className="action-btn" style={{ paddingLeft: 0 }}>
            <div>
              <Icon name="add circle" />
              <div className="text" id="button-add-document">Add Document</div>
            </div>
          </div>
        }
      />
    )
  }
}

ComponentAddDocument.propTypes = {
  remainingDocs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
  })).isRequired,
  handleAddDocument: PropTypes.func.isRequired,
}

export default ComponentAddDocument
