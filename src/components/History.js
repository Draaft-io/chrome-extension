import PropTypes from "prop-types"
import { compose } from "ramda"
import React from "react"
import { List, Header, Segment, Divider } from "semantic-ui-react"
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
      <div className="flex">
        <Header className="logo-header"><img src="../../images/draaft_logo_light.svg"/></Header>
        <Segment style={{ paddingBottom: "0" }}>
          <Header as="h2" textAlign="center">SAVE HISTORY</Header>
          <List divided>
            {this.props.user.components.map(component => (
              <List.Item className="action-item" key={component._id}>
                <List.Content>
                  <List.Header>{component.title}</List.Header>
                  <List.Description>{component.documents.length > 0 ? component.documents[0].title : "Not assigned yet"}</List.Description>
                </List.Content>
                <List.Content className="actions">
                  <List.Icon link name="linkify" onClick={() => handleLinkClick(component)} />
                  <List.Icon link name="trash" onClick={this.handleDeleteClick.bind(this, component._id)} />
                </List.Content>
              </List.Item>
              ))}
          </List>
        </Segment>
        <Segment textAlign="center" style={{ paddingBottom: "1.5rem" }}>
          <LogoutForm />
        </Segment>
      </div>
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
