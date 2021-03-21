import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import {format} from 'date-fns';
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
  activity: Activity;
}

export default function ActivityItem({ activity }: Props) {
 
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled&&
          <Label attached='top' color='red' content='Cancelled' style={{textAlign:'center'}}  />
        }
        <Item.Group>
          <Item>
            <Item.Image circular size="tiny" style={{marginBottom:5}} src={activity.host?.image||"/assets/user.png"} />
            <Item.Content className="activityItemHeader">
              <Item.Header
                as={Link}
                to={`/activities/${activity.id}`}
                content={activity.title}
              />
              <Item.Description>Hosted by <Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName}</Link></Item.Description>
              {activity.isHost&&(
                <Item.Description>
                  <Label basic color='orange' content='You are hosting the activity'/>
                </Item.Description>
              )}
                {activity.isGoing&& !activity.isHost &&(
                <Item.Description>
                  <Label basic color='green' content='You are going to the activity'/>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
          <span>
              <Icon name="clock"/>{format(activity.date!,'dd MMM yyyy h:mm aa')}
              <Icon name="marker"/>{activity.venue}
          </span>
      </Segment>
      <Segment secondary>
       <ActivityListItemAttendee attendees={activity.attendees!}/>
      </Segment>
      <Segment clearing>
          <span>{activity.description}</span>
          <Button as={Link} to={`/activities/${activity.id}`}
            color='teal'
            floated='right'
            content='View'
          />
      </Segment>
    </Segment.Group>
  );
}
