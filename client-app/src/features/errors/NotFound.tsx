import React from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

export default function NotFound() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search"/>
        Oops- We have looked everywhere and could not find this         
      </Header>
      <Segment.Inline>
          <Button as={Link} to='/activities' primary content='Return to Activities' />
      </Segment.Inline>
    </Segment>

  );
}
