import React from "react";
import { Segment, List, Label, Item, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
}

export default observer(function ActivityDetailedSidebar({ activity }: Props) {
 
    if(!activity.attendees) return null;
    return (
    <>
      <Segment
      className="tealHeader"
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {activity.attendees.length} {activity.attendees.length === 1 ? "Person" : "People"} going
      </Segment>
      <Segment attached className="detailedSidebar" >
        <List relaxed divided>
          {activity.attendees.map((attendee) => (
            <Item style={{ position: "relative" }} key={attendee.username}>
              {attendee.username===activity.hostUsername && <Label
                style={{ position: "absolute" }}
                color="orange"
                ribbon="right"
              >
                Host
              </Label>}
              <Image size="tiny" src={attendee.image||"/assets/user.png"} />
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profiles/${attendee.username}`}>{attendee.displayName}</Link>
                </Item.Header>
              {attendee.isFollowing&&
                <Item.Extra style={{ color: "orange" }}>Following</Item.Extra>}
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </>
  );
});
