import React from "react"
import PropTypes from "prop-types"
import { Input } from "semantic-ui-react"

class TreeInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { title: this.props.node.title }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    this.inputSection.focus()
  }

  save() {
    const { title } = this.state
    this.props.updateSectionTitle(this.props.node, title)
  }

  handleChange(ev, { value }) {
    ev.preventDefault()
    this.setState({ title: value })
  }

  handleKeyDown(e) {
    // Remove the section when title is empty and hitting BACKSPACE
    if (this.state.title.length === 0 && e.keyCode === 8 /* BACKSPACE */) {
      this.props.removeSection(this.props.node._id)
    }
    // Save title on ENTER
    if (e.keyCode === 13 /* ENTER */) {
      e.preventDefault()
      this.save()
    }
    // Abort editing when ESC is pressed
    if (e.keyCode === 27 /* ESC */) {
      this.props.selectSection({ value: null })
    }
  }

  render() {
    return (
      <Input
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        ref={i => this.inputSection = i}
        transparent
        value={this.state.title}
      />
    )
  }
}

TreeInput.displayName = "TreeInput"
TreeInput.propTypes = {
  updateSectionTitle: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  selectSection: PropTypes.func.isRequired,
  node: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
}
export default TreeInput
