import React from "react"
import PropTypes from "prop-types"
import { compose, equals, contains, uniq, propEq, propOr, pluck, remove, prop, flatten, map, update, head, filter, pathOr } from "ramda"
import _JSXStyle from "styled-jsx/style"
import { Form, Dropdown, Icon, Input } from "semantic-ui-react"
import QuillEditor from "../../BaseComponents/QuillEditor/QuillEditor"
import ComponentAdd from "../ComponentAdd/ComponentAdd"
import ComponentTagView from "../ComponentTagView/ComponentTagView"
import { stylesheet, classNames } from "./ComponentForm.css"

/**
 * Component Form for Creating & Editing Components
 * - handles its own state
 * - provides hooks for updating single fields
 * - when createComponent is provided, it shows a Save button
 */

 
class ComponentForm extends React.Component {
  constructor(props) {
    super(props)
    const projects = map(pr => ({ value: pr._id, text: pr.title }))(pathOr([], [ "projects" ], this.props))
    this.state = {
      form: {
        title: pathOr("", [ "element", "title" ], props),
        content: pathOr("", [ "element", "data", "content" ], props),
        url: pathOr("", [ "element", "url" ], props),
        tags: compose(pluck("_id"), pathOr([], [ "element", "tags" ]))(props),
        selectionArray: uniq(props.selectionArray) || [],
        project: compose(propOr(null, "value"), head)(projects),
      },
      projects,
    }

    this.handleAddDocument = this.handleAddDocument.bind(this)
    this.handleAddSection = this.handleAddSection.bind(this)
    this.handleDeleteDocSection = this.handleDeleteDocSection.bind(this)
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this)
    this.handleUpdateContent = this.handleUpdateContent.bind(this)
    this.handleUpdateURL = this.handleUpdateURL.bind(this)
    this.getDocuments = this.getDocuments.bind(this)
  }

  getDocuments() {
    if (this.props.projects && !this.props.project) {
      return compose(propOr([], "documents"), head, filter(propEq("_id", this.state.form.project)))(this.props.projects)
    }
    return pathOr([], [ "project", "documents" ], this.props)
  }

  // When the component is assigned to a document
  handleAddDocument(documentId) {
    const documents = this.getDocuments()
    const documentTitle = compose(prop("title"), head, filter(propEq("_id", documentId)))(documents)

    const selectionArray = uniq([ ...this.state.form.selectionArray, { documentId, documentTitle, sectionId: null, sectionTitle: null }])

    // If the selectionArray doesn't change, do nothing. Do deep comparison.
    if (equals(uniq(this.state.form.selectionArray), selectionArray)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.setState({
        form: {
          ...this.state.form,
          selectionArray,
        },
      }, () => {
        if (this.props.addComponentToDoc) this.props.addComponentToDoc(documentId)
        resolve(documentId)
      })
    })
  }

  // When the component is assigned to a document section
  handleAddSection({ value }, sectionId, documentId, index) {
    const { form: { selectionArray } } = this.state
    const documents = this.getDocuments()
    const sectionTitle = compose(prop("title"), head, filter(propEq("_id", value)), flatten, map(doc => doc.data.sections))(documents)
    const newEntry = { ...selectionArray[index], sectionId: value, sectionTitle }

    // Prevent double entries
    if (contains(newEntry)(selectionArray)) return

    const updatedSelectionArray = compose(uniq, update(index, newEntry))(uniq(selectionArray))

    return new Promise((resolve, reject) => {
      this.setState({ form: { ...this.state.form, selectionArray: updatedSelectionArray } })
      if (this.props.addComponentToDocSection) this.props.addComponentToDocSection(documentId, value, index)
      resolve()
    })
  }

  handleDeleteDocSection(documentId, sectionId, index) {
    const selectionArray = remove(index, 1, this.state.form.selectionArray)
    this.setState({ form: { ...this.state.form, selectionArray } }, () => {
      this.props.deleteDocSection && this.props.deleteDocSection(documentId, sectionId, index)
    })
  }

  handleUpdateContent(value) {
    this.props.updateContent && this.props.updateContent(value)
  }

  handleUpdateTitle() {
    this.props.updateTitle && this.props.updateTitle(this.state.form.title)
  }

  handleUpdateURL() {
    this.props.updateURL && this.props.updateURL(this.state.form.url)
  }

  render() {
    const remainingDocs = this.getDocuments()
    const project = this.props.project || compose(head, filter(propEq("_id", this.state.form.project)))(this.props.projects)

    return (
      <Form id="element-form">
        <div className="fields-wrapper">
          <Form.Field id="input-element-title-field">
            <div>ELEMENT {!this.props.createComponent ? <Icon link name="trash" id="button-delete-element" onClick={this.props.deleteComponent} /> : null}</div>
            <Input fluid id="input-element-title" onBlur={this.handleUpdateTitle} onChange={(ev, { value }) => this.setState({ form: { ...this.state.form, title: value } })} placeholder="Name your element" type="text" value={this.state.form.title} />
          </Form.Field>
          <Form.Field id="input-element-content-field">
            <div>CONTENT</div>
            <QuillEditor onBlur={this.handleUpdateContent} onChange={content => this.setState({ form: { ...this.state.form, content } })} value={this.state.form.content} />
          </Form.Field>
          <Form.Field id="input-element-url-field">
            <div>SOURCE URL</div>
            <Input id="input-element-url" onBlur={this.handleUpdateURL} onChange={(ev, { value }) => this.setState({ form: { ...this.state.form, url: value } })} placeholder="Enter the source url" value={this.state.form.url} />
          </Form.Field>
          <Form.Field id="input-element-tags-field">
            <div>TAGS</div>
            <ComponentTagView
              elementIds={[ this.props.element._id ]}
              existingTags={this.state.form.tags}
              onChange={tags => this.setState({ form: { ...this.state.form, tags } })}
              stateOnly={this.props.stateOnly}
              tags={pathOr([], [ "project", "tags" ], this.props)}
            />
          </Form.Field>
          {this.props.projects
            ? (
              <Form.Field>
                <div>PROJECT</div>
                <Dropdown
                  allowAdditions
                  disabled={this.props.disableProject}
                  fluid
                  id="select-project"
                  onAddItem={(ev, { value }) => this.setState({ projects: [ ...this.state.projects, { value, text: value }] })}
                  onChange={(ev, { value }) => this.setState({ form: { ...this.state.form, selectionArray: [], project: value } })}
                  options={this.state.projects}
                  placeholder="Choose project"
                  search
                  selection
                  style={{ width: "100%" }}
                  value={this.state.form.project}
                />
              </Form.Field>
            )
            : null
          }
          <Form.Field>
            <div>ADDED TO</div>
            <ComponentAdd
              handleAddDocument={this.handleAddDocument}
              handleSelectSection={this.handleAddSection}
              handleDeleteClick={this.handleDeleteDocSection}
              project={project}
              remainingDocs={remainingDocs}
              selectedDocuments={[]}
              selectedElementIds={this.props.selectedElementIds}
              selectionArray={this.state.form.selectionArray}
            />
          </Form.Field>
          {this.props.createComponent
            ? <Form.Button className={`submit-btn ${classNames.button}`} content="Create" fluid id="button-element-create" onClick={ev => this.props.createComponent(ev, this.state.form)} />
            : null}
        </div>
        <_JSXStyle styleId="ComponentForm" css={stylesheet} />
      </Form>
    )
  }
}

ComponentForm.displayName = "ComponentForm"
ComponentForm.propTypes = {
  createComponent: PropTypes.func,
  project: PropTypes.shape({
    documents: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
    })),
    tags: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
    })),
  }),
  element: PropTypes.shape({
    _id: PropTypes.string,
    documents: PropTypes.array,
    title: PropTypes.string,
    url: PropTypes.string,
    data: PropTypes.shape({
      content: PropTypes.string,
    }),
  }),
  projects: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
  })),
  selectionArray: PropTypes.arrayOf(PropTypes.shape({
    documentId: PropTypes.string,
    documentTitle: PropTypes.string,
    sectionId: PropTypes.string,
    sectionTitle: PropTypes.string,
  })),
  deleteComponent: PropTypes.func,
  selectedElementIds: PropTypes.arrayOf(PropTypes.string),
  updateURL: PropTypes.func,
  updateTitle: PropTypes.func,
  updateContent: PropTypes.func,
  stateOnly: PropTypes.bool,
  disableProject: PropTypes.bool,
}

ComponentForm.defaultProps = {
  project: null,
  projects: null,
  createComponent: null,
  selectionArray: [],
  element: { documents: [] },
  selectedElementIds: [],
  deleteComponent: null,
  updateURL: () => null,
  updateTitle: () => null,
  updateContent: () => null,
  stateOnly: false,
  disableProject: false,
}

export default ComponentForm
