import React, { Fragment } from "react";
import { Header} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Activity } from "../../../app/models/activity";
import ActivityItem from "./ActivityItem";

function ActivityList() {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;

  return (
    <>
      {groupedActivities.map(([dates, activities]) => (
        <Fragment key={dates}>
          <Header sub color="teal">
            {dates}
          </Header>
          {activities.map((activity: Activity) => (
            <ActivityItem key={activity.id+Math.random()} activity={activity} />
          ))}
        </Fragment>
      ))}
    </>
  );
}

export default observer(ActivityList);
