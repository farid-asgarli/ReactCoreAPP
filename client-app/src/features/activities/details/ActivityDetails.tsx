import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/loadingComponent/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

 function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity, loadActivity,loadingInitial,clearSelectedActivity } = activityStore;

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }
    return ()=>clearSelectedActivity();
  }, [id, loadActivity,clearSelectedActivity]);

  if(loadingInitial || !selectedActivity) return <LoadingComponent/>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={selectedActivity}/>
        <ActivityDetailedInfo activity={selectedActivity}/>
        <ActivityDetailedChat activityId={selectedActivity.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={selectedActivity}/>
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDetails);