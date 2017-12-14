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
    }
    this.save = this.save.bind(this)
  }

  save(ev, form) {
    ev.preventDefault()
    const importSections = map(item => ({ documentId: item.documentId, sectionId: item.sectionId }))(form.selectionArray)
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
      if (this.props.data.currentUser.settings.showImportSuccessScreen) {
        this.setState({
          result: {
            saved: true, success: true, elementId: res.data.elementImport._id, message: null,
          },
        })
      } else {
        // window.close()
      }
    })
  }

  render() {
    const loading = pathOr(null, [ "data", "loading" ], this.props)
    const settings = pathOr(null, [ "data", "currentUser", "settings" ], this.props)

    // When still loading, show loading Page
    if (loading) {
      return <LoadingPage />
    }

    if (this.state.result.saved && settings && settings.showImportSuccessScreen) {
      return (
        <ComponentImportSuccess
          result={this.state.result}
          removeElement={this.props.removeElement}
          setShowImportSuccessScreen={this.props.setShowImportSuccessScreen}
          showImportSuccessScreen={this.props.data.currentUser.settings.showImportSuccessScreen}
        />
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
    return (
      <Container id="import-container">
        <ComponentForm
          element={element}
          projects={projects}
          createComponent={this.save}
        />
      </Container>
    )
  }
}

ComponentImportContainer.displayName = "ComponentImportContainer"
ComponentImportContainer.propTypes = {
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
