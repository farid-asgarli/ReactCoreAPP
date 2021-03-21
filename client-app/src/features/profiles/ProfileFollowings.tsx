import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";

interface Props{
    predicate:string
}

function ProfileFollowings({predicate}:Props) {
  const {
    profileStore: { profile, followings, loadFollowings, loadingFollowings },
  } = useStore();

  useEffect(() => {
      loadFollowings(predicate)
  }, [loadFollowings,predicate])

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={predicate==="followers"?`People following ${profile?.displayName}`:`People  ${profile?.displayName} follows`}
          />
        </Grid.Column>
        <Grid.Column width="16" >
            <Card.Group itemsPerRow="4" >
                {followings.map(profile=>
                    <ProfileCard profile={profile} key={profile.username} />
                    )}
            </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}

export default observer(ProfileFollowings);
