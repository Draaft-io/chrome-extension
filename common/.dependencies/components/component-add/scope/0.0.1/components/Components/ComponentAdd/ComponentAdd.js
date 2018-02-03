import React from "react"
import PropTypes from "prop-types"
import { List } from "semantic-ui-react"
import { compose, pathOr, uniq, defaultTo, map, head, filter, propEq } from "ramda"
import { getDocumentArray } from "../../../lib/helpers/getDocumentArray"
import ComponentAddSection from "./ComponendAddSection"
import ComponentAddDocument from "./ComponentAddDocument"

/**
 * - Takes all project documents and shows a list of documents / sections that contain the component
 * - Allows for adding documents and sections to the component
 */
export default class ComponentAdd extends React.Component {
  render() {
    // Count documents and sections in the project to which the element could be assigned to
    const docs = defaultTo([], pathOr([], [ "documents" ], this.props.project))
    const documentArray = uniq(this.props.selectionArray)

    return (
      <List className="document-section-list">
        {documentArray.map((doc, index) => {
          const key = index
          const docum = compose(head, filter(propEq("_id", doc.documentId)))(docs)
          if (!docum) return null
          const sectionsCount = compose(head, map(d => d.data.sections.length), filter(propEq("_id", doc.documentId)))(this.props.selectedDocuments) || 1
          return (
            <ComponentAddSection
              docItem={doc}
              document={docum}
              index={index}
              key={`document-section-${doc.documentId}-${doc.sectionId}-${key}`}
              sectionsCount={sectionsCount}
              handleDeleteClick={this.props.handleDeleteClick}
              handleSelectSection={this.props.handleSelectSection}
            />
          )
        })}
        <ComponentAddDocument handleAddDocument={this.props.handleAddDocument} remainingDocs={this.props.remainingDocs} />
      </List>
    )
  }
}

ComponentAdd.propTypes = {
  project: PropTypes.shape({
    documents: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      data: PropTypes.shape({
        sections: PropTypes.arrayOf(PropTypes.shape({
          _id: PropTypes.string.isRequired,
          components: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string,
          })),
        })),
      }),
      title: PropTypes.string,
    })),
  }),
  remainingDocs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
  })).isRequired,
  selectionArray: PropTypes.arrayOf(PropTypes.shape({
    documentId: PropTypes.string,
    documentTitle: PropTypes.string,
    sectionId: PropTypes.string,
    sectionTitle: PropTypes.string,
  })),
  handleSelectSection: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  handleAddDocument: PropTypes.func.isRequired,
  selectedElementIds: PropTypes.arrayOf(PropTypes.string),
  selectedDocuments: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    components: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
    })),
  })),
}

ComponentAdd.defaultProps = {
  project: {
    documents: [],
  },
  selectionArray: undefined,
  selectedDocuments: [],
  selectedElementIds: [],
}
