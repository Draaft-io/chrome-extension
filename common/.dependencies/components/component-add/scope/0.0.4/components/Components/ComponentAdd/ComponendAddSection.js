import React from "react"
import PropTypes from "prop-types"
import { List, Label, Popup, Icon } from "semantic-ui-react"
import DocumentTreeStructure from "../../Documents/DocumentTreeStructure/DocumentTreeStructure"

class ComponentAddSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  render() {
    return (
      <List.Item className="document-section-item" style={{ paddingLeft: 0 }}>
        <List.Content className="document-wrapper" floated="left" verticalAlign="middle" >
          <Label as="a" className="component-in-document">{this.props.docItem.documentTitle}</Label>
        </List.Content>
        <Popup
          content={
            this.props.document.data.sections.length > 0
              ? <div style={{ width: "17rem" }}>
                <DocumentTreeStructure
                  disableTreeDrag
                  document={this.props.document}
                  editable={false}
                  editSection={() => null}
                  editedSection={null}
                  expandCloseAll
                  id="list-select-section"
                  mainNodeHide={false}
                  nodeScrolling
                  selectSection={val => this.props.handleSelectSection(val, this.props.docItem.sectionId, this.props.docItem.documentId, this.props.index)}
                  selectedSection={[]}
                />
                </div>
              : null
          }
          on="click"
          onOpen={() => { if (this.props.sectionsCount > 0) this.setState({ open: true }) }}
          onClose={() => this.setState({ open: false })}
          open={this.props.document.data.sections.length > 0 ? this.state.open : false}
          position="top right"
          trigger={
            // Workaround of semantic-ui-react bug, should actually be List.Content
            <div className="left floated middle aligned content section-wrapper">
              {this.props.sectionsCount === 0 || this.props.document.data.sections.length === 0
                ? <div className="select-section" id="button-select-section" onClick={(ev) => { ev.preventDefault(); ev.stopPropagation() }}>No Sections Available</div>
                : null
              }
              {this.props.docItem.sectionTitle
                ? <div className="select-section" id="button-select-section" >{this.props.docItem.sectionTitle}<Icon name="dropdown" /></div>
                : null
              }
              {(!this.props.docItem.sectionTitle && this.props.sectionsCount > 0 && this.props.document.data.sections.length > 0)
                ? <div className="select-section" id="button-select-section" >Select a Section<Icon link name="dropdown" /></div>
                : null
              }
            </div>
          }
        />
        <List.Content className="delete-wrapper">
          <List.Icon className="button-section-delete" link name="delete" onClick={() => this.props.handleDeleteClick(this.props.docItem.documentId, this.props.docItem.sectionId, this.props.index)} />
        </List.Content>
      </List.Item>
    )
  }
}

ComponentAddSection.propTypes = {
  document: PropTypes.shape({
    _id: PropTypes.string,
    data: PropTypes.shape({
      sections: PropTypes.array,
    }),
  }).isRequired,
  docItem: PropTypes.shape({
    documentId: PropTypes.string,
    documentTitle: PropTypes.string,
    sectionId: PropTypes.string,
    sectionTitle: PropTypes.string,
  }).isRequired,
  sectionsCount: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  handleSelectSection: PropTypes.func.isRequired,
}

export default ComponentAddSection
