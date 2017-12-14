import React from "react"
import PropTypes from "prop-types"
import { Checkbox, Button, Form, Header, Container, Message, Icon } from "semantic-ui-react"

export class ComponentImportSuccess extends React.Component {
  constructor(props) {
    super(props)
    this.state = { removing: null }
    this.handleCancelImport = this.handleCancelImport.bind(this)
  }

  componentDidMount() {
    if (this.props.showImportSuccessScreen) {
      setTimeout(() => {
        (window.opener || window.parent).postMessage({ method: "close" }, "*")
      }, 3 * 1000)
    }
  }

  handleCancelImport(ev) {
    ev.preventDefault()
    this.setState({ removing: "removing" })
    this.props.removeElement({ elementId: this.props.result.elementId }).then(() => this.setState({ removing: "removed" }))
  }

  render() {
    const { result: { success, message }, setShowImportSuccessScreen } = this.props

    if (success) {
      return (
        <Container textAlign="center">
          <Icon name="check circle outline" size="massive" />
          <Header as="h1">Thank You!</Header>
          <p>Your element was saved into Draaft.</p>
          <Form>
            <Form.Field>
              {this.state.removing === "removed"
                ? <Button content="Element Import Cancelled" icon="check" onClick={ev => ev.preventDefault()} primary />
                : <Button content="Cancel Saving" icon="undo" id="button-cancel" loading={this.state.removing === "removing"} onClick={this.handleCancelImport} primary />
              }
            </Form.Field>
            <Form.Field>
              <Checkbox id="checkbox-disable-message" label="Don't show this page again" onChange={() => setShowImportSuccessScreen({ value: false })} />
            </Form.Field>
          </Form>
        </Container>
      )
    }
    return (
      <Container textAlign="center">
        <Header as="h1">An Error Occurred</Header>
        <p>The element could not be saved</p>
        <Message content={message} />
      </Container>
    )
  }
}

ComponentImportSuccess.displayName = "ComponentImportSuccess"
ComponentImportSuccess.propTypes = {
  result: PropTypes.shape({
    message: PropTypes.string,
    success: PropTypes.bool,
    elementId: PropTypes.string,
  }),
  showImportSuccessScreen: PropTypes.bool.isRequired,
  setShowImportSuccessScreen: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
}

ComponentImportSuccess.defaultProps = {
  result: {
    message: "",
    success: false,
  },
}
