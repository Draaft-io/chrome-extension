import React from "react"
import { compose, map, pathOr } from "ramda"
import { graphql } from "react-apollo"
import { Container } from "semantic-ui-react"
import PropTypes from "prop-types"
import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { elementImportMutation } from "../../common/mutations/element-import"
import { removeElementMutation } from "../../common/mutations/element-remove"
import { setShowImportSuccessScreenMutation } from "../../common/mutations/set-show-import-success-screen"
import ComponentForm from "../../common/components/component-form"
import QUERY_ELEMENT_IMPORT from "../graphql/query_element_import"
import LoadingPage from "../../common/components/loading-page/"
import { ComponentImportSuccess } from "../../common/components/component-import-success"

class ComponentImportContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      result: {
        saved: false, elementId: null, message: null, success: false,
      },
      selectionArray: null,
      projectId: null,
    }

    this.save = this.save.bind(this)
    this.restoreSelection = this.restoreSelection.bind(this)
  }

  save(ev, form) {
    ev.preventDefault()

    // Get Selection
    const importSections = map(item => ({ documentId: item.documentId, sectionId: item.sectionId }))(form.selectionArray)

    // Save selectionArray to Chrome Storage
    chrome.storage.sync.set({ selectionArray: form.selectionArray })
    chrome.storage.sync.set({ projectId: form.project })

    this.props.elementImport({
      projectId: form.project,
      selectionArray: importSections,
      tags: form.tags || "",
      text: form.content,
      title: form.title,
      url: form.url,
    }).catch((err) => {
      this.setState({
        result: {
          saved: true, success: false, elementId: null, message: err,
        },
      })
    }).then((res) => {
      this.setState({
        result: {
          saved: true, success: true, elementId: res.data.elementImport._id, message: null,
        },
      })
    })
  }

  restoreSelection() {
    chrome.storage.sync.get("selectionArray", ({ selectionArray }) => {
      if (Array.isArray(selectionArray) && selectionArray.length > 0) {
        this.setState({ selectionArray })
      }
    })
    chrome.storage.sync.get("projectId", ({ projectId }) => {
      this.setState({ projectId })
    })
  }

  render() {
    const loading = pathOr(null, [ "data", "loading" ], this.props)
    console.log(this.state)
    // When still loading, show loading Page
    if (loading) {
      return <LoadingPage />
    }

    if (this.state.result.saved) {
      console.log("SSS", this.state.result)
      return (
        <div style={{ marginTop: "12rem" }}>
          <ComponentImportSuccess
            result={this.state.result}
            removeElement={this.props.removeElement}
            setShowImportSuccessScreen={this.props.setShowImportSuccessScreen}
            showImportSuccessScreen={this.props.data.currentUser.settings.showImportSuccessScreen}
            closeTimeout={2 * 1000}
          />
        </div>
      )
    }

    const projects = pathOr([], [ "data", "currentUser", "projects" ], this.props)
    const element = {
      _id: "",
      url: this.props.url,
      data: {
        content: this.props.selection,
      },
    }

    const selectionArray = pathOr([], [ "selectionArray" ], this.state)

    return (
      <Container id="import-container">
        <a onClick={() => this.props.changePage("history")} style={{ position: "absolute", right: "1rem", top: "12px", fontSize: 12, cursor: "pointer", zIndex: 1000000 }}>HISTORY</a>
        <ComponentForm
          element={element}
          projects={projects}
          createComponent={this.save}
          restoreSelection={this.restoreSelection}
          selectionArray={selectionArray}
          selectedProject={this.state.projectId}
        />
      </Container>
    )
  }
}

ComponentImportContainer.displayName = "ComponentImportContainer"
ComponentImportContainer.propTypes = {
  changePage: PropTypes.func.isRequired,
  elementImport: PropTypes.func.isRequired,
  setShowImportSuccessScreen: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  data: PropTypes.shape({
    currentUser: PropTypes.shape({
      settings: PropTypes.shape({
        showImportSuccessScreen: PropTypes.bool,
      }),
    }),
  }).isRequired,
  url: PropTypes.string.isRequired,
  selection: PropTypes.string.isRequired,
}
export default compose(
  setShowImportSuccessScreenMutation,
  removeElementMutation,
  elementImportMutation,
  graphql(QUERY_ELEMENT_IMPORT),
  DragDropContext(HTML5Backend),
)(ComponentImportContainer)
