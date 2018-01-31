import React from "react"
import PropTypes from "prop-types"
import "./QuillEditor.less"

// Prevent loading on server
const isBrowser = typeof window !== "undefined"
const ReactQuill = isBrowser ? require("react-quill") : undefined

const modules = {
  toolbar: [
    [ "bold", "italic", "underline" ],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ header: [ 2, 3, false ] }],
    [ "clean" ],
  ],
}

const formats = [
  "bold", "italic", "underline",
  "list", "bullet",
  "header",
]

class QuillEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: this.props.value }
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleChange(value) {
    this.setState({ text: value })
    this.props.onChange(value)
  }

  handleBlur() {
    this.props.onBlur(this.state.text)
  }

  render() {
    return (
      <ReactQuill
        formats={formats}
        modules={modules}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        theme="snow"
        value={this.state.text}
      />
    )
  }
}

QuillEditor.displayName = "QuillEditor"
QuillEditor.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
}
QuillEditor.defaultProps = {
  value: "",
  onBlur: () => null,
  onChange: () => null,
}
export default QuillEditor
