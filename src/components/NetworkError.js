import React from "react"
import { Container, Header, Icon } from "semantic-ui-react"

export default () => {
  return (
    <Container style={{ marginTop: "13rem" }}>
      <Header as="h1" icon>
        <Icon name='plug' />
        <Header.Content>Sorry, we couldn't connect to our server.</Header.Content>
        <Header.Subheader>Please try again later</Header.Subheader>
      </Header>
    </Container>
  )
}