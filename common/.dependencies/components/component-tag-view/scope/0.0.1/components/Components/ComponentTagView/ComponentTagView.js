import React from "react"
import PropTypes from "prop-types"
import { Dropdown } from "semantic-ui-react"
import { compose, defaultTo, difference, reject, isNil, append, pluck, head, map, filter, contains } from "ramda"
import _JSXStyle from "styled-jsx/style"
import { stylesheet, classNames } from "./ComponentTagView.css"
import { updateElementTagsMutation } from "../../../graphql/mutations/updateElementTags"

const renderLabel = (label, index) => ({
  content: `${label.text}`,
  icon: "tag",
  key: index,
})

class ComponentTagView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tagOptions: map(tag => ({ key: tag._id, text: tag.title, value: tag._id }))(defaultTo([], this.props.tags)),
      selectedTags: this.props.existingTags,
    }

    this.handleTagAddition = this.handleTagAddition.bind(this)
    this.handleTagChange = this.handleTagChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleTagAddition(ev, { value }) {
    ev.preventDefault()
    this.setState({
      tagOptions: [{ key: value, text: value, value }, ...this.state.tagOptions ],
    })
  }

  handleTagChange(ev, { value }) {
    ev.preventDefault()
    ev.stopPropagation()

    this.setState({ selectedTags: value })
    // Propagate changes to parent
    this.props.onChange && this.props.onChange(value)

    // newly created tags
    const newTagText = head(difference(value, pluck("_id", this.props.tags)))
    const newTag = { _id: newTagText, title: newTagText }

    // Filter all parent tags that also are in the component state -> drops removed tags
    const tags = compose(reject(x => isNil(x._id)), append(newTag), filter(t => contains(t._id)(value)))(this.props.tags)

    // Update elements if in update mode
    this.props.updateElementTags && !this.props.stateOnly && this.props.updateElementTags({ elementIds: this.props.elementIds, tags })
  }

  handleBlur() {
    this.props.onBlur && this.props.onBlur(this.state.selectedTags)
  }

  render() {
    return (
      <div>
        <Dropdown
          allowAdditions
          className={`tags ${classNames.dropdown}`}
          fluid
          id="input-element-tags"
          multiple
          onAddItem={this.handleTagAddition}
          onBlur={this.handleBlur}
          onChange={this.handleTagChange}
          options={this.state.tagOptions}
          placeholder="Add tag"
          renderLabel={renderLabel}
          search
          selection
          style={{ width: "100%" }}
          text="Add tag"
          value={this.state.selectedTags}
        />
        <_JSXStyle styleId="ComponentTagView" css={stylesheet} />
      </div>
    )
  }
}

ComponentTagView.displayName = "ComponentTagView"
ComponentTagView.propTypes = {
  elementIds: PropTypes.arrayOf(PropTypes.string),
  existingTags: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  updateElementTags: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  stateOnly: PropTypes.bool,
}

ComponentTagView.defaultProps = {
  elementIds: [],
  existingTags: [],
  onChange: null,
  onBlur: null,
  updateElementTags: null,
  stateOnly: false,
}
export default compose(updateElementTagsMutation)(ComponentTagView)
