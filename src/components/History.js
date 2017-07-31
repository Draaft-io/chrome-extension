import PropTypes from "prop-types"
import { compose } from "ramda"
import React from "react"
import { List } from "semantic-ui-react"
import LogoutForm from "./LogoutForm"
import { removeElementMutation } from "../graphql/mutation_remove_component"
import { URL } from "../config"

function handleLinkClick(component) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0]
    const domain = tab.url.split("/")[2]
    if (domain !== URL) {
      chrome.tabs.create({ active: true, url: `https://${URL}/project/${component.project._id}?componentId=${component._id}` })
    } else {
      chrome.tabs.update({ active: true, url: `https://${URL}/project/${component.project._id}?componentId=${component._id}` })
    }
  })
}

class History extends React.Component {
  handleDeleteClick(componentId) {
    this.props.removeElement(componentId).then(() => {
      this.props.refetch()
    })
  }

  render() {
    return (
      <List divided>
        <List.Item>SAVE HISTORY</List.Item>
        {this.props.user.components.map(component => (
          <List.Item key={component._id}>
            <List.Content floated="left">
              <List.Header>{component.title}</List.Header>
              <List.Description>{component.documents.length > 0 ? component.documents[0].title : "Not assigned yet"}</List.Description>
            </List.Content>
            <List.Content floated="right">
              <List.Icon link name="trash" onClick={this.handleDeleteClick.bind(this, component._id)} verticalAlign="middle" />
              <List.Icon link name="linkify" onClick={() => handleLinkClick(component)} verticalAlign="middle" />
            </List.Content>
          </List.Item>
          ))}
        <LogoutForm />
      </List>
    )
  }
}

History.displayName = "History"
History.propTypes = {
  refetch: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    components: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
    })),
  }).isRequired,
}

export default compose(
  removeElementMutation,
)(History)
