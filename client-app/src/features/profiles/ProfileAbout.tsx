import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Grid, Header, Item, Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";

interface Props {
  profile: Profile | null;
}


function ProfileAbout({ profile }: Props) {

const [editForm, setEditForm] = useState<boolean>(false);

const {profileStore, userStore} = useStore();

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={10}>
          <Item.Group>
            <Item>
              <Item.Content>
              <Header icon="image" content={`About ${profile?.displayName}`} floated='left' />
              </Item.Content>
            </Item>
           
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={6}>
          {profileStore.profile?.username===userStore.user?.username&&
          <Button content={editForm?"Cancel":"Edit Profile"} onClick={()=>setEditForm(!editForm)} floated="right" basic />
        }
        </Grid.Column>
        <Grid.Column width={16} >
        <Item>
              {editForm?
              <ProfileEditForm setEditForm={setEditForm} />:<Item.Content style={{whiteSpace: 'pre-wrap'}}>{profile?.bio}</Item.Content>}
            </Item>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}
export default observer(ProfileAbout);
