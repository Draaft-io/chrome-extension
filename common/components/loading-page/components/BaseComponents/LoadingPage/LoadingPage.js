import React from "react"
import PropTypes from "prop-types"
import { Grid, Header, Icon, List, Modal } from "semantic-ui-react"
import _JSXStyle from "styled-jsx/style"
import { stylesheet, classNames } from "./LoadingPage.css"

const LoadingPage = ({ errors }) => (
  <Modal basic dimmer="inverted" open>
    <Modal.Content>
      {errors
        ? <Grid container textAlign="center">
          <Grid.Row>
            <Header as="h1">
              <Icon name="warning sign" />
              <Header.Content color="red">
                  Data Loading Error
              </Header.Content>
            </Header>
          </Grid.Row>
          <List verticalAlign="middle">
            {errors.graphQLErrors && errors.graphQLErrors.map((error, index) => (
              <List.Item key={index}>
                <List.Content>{error.message}</List.Content>
              </List.Item>
            ))}
            {errors.message && <List.Item>{errors.message}</List.Item>}
          </List>
        </Grid>
        : <div className={`${classNames.loading} ${classNames.box}`} />
      }
    </Modal.Content>
    <_JSXStyle styleId="LoadingPage" css={stylesheet} />
  </Modal>
)

LoadingPage.displayName = "LoadingPage"
LoadingPage.propTypes = {
  errors: PropTypes.shape({
    graphQLErrors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string,
    })),
  }),
}
LoadingPage.defaultProps = {
  errors: null,
}

export default LoadingPage
