import { observer } from "mobx-react-lite";
import React, { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props{
    profile:Profile;
}

function FollowButton({ profile }: Props) {
  const { profileStore, userStore } = useStore();

  const { updateFollowing, loading } = profileStore;

  if (userStore.user?.username === profile.username) return null;

  const handleFollow = (e: SyntheticEvent, username: string) => {
    e.preventDefault();
    profile.isFollowing
      ? updateFollowing(username, false)
      : updateFollowing(username, true);
  };

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.isFollowing ? "Following" : "Not Following"}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          fluid
          basic
          color={profile.isFollowing?"red":"green"}
          content={profile.isFollowing ? "Unfollow" : "Follow"}
          loading={loading}
          onClick={e=>handleFollow(e,profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
}


export default observer(FollowButton);