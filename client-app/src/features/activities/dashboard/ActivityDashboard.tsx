import React, { useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import ActivityList from "../activitylist/ActivityList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import { Redirect } from "react-router-dom";
import { PagingParams } from "../../../app/models/pagination";
import ActivityListItemPlaceholder from "./ActivityItemPlaceholder";



const Activitydashboard = () => {
  const { activityStore,userStore,commentStore } = useStore();

  const {activities ,loadActivities,refreshActivities,loadingInitial, setPagingParams, pagination} = activityStore;
  const [loadingNext, setLoadingNext] = useState<boolean>(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage+1));
    loadActivities().then(()=>setLoadingNext(false));
  }




  useEffect(() => {
   if(activities.length===0){
   loadActivities();
   }

  }, [loadActivities,activities,commentStore]);

  
  return (
   <React.Fragment>
     {userStore.user?
      <Grid>
      <Grid.Column width="10">
        {loadingInitial && (
          <>
        <Button style={{marginBottom:25  }} content='Refresh activities' disabled/>

          <ActivityListItemPlaceholder />
          <ActivityListItemPlaceholder />
          </>
        )}
        <Button style={{marginBottom:25  }} content='Refresh activities' onClick={()=>refreshActivities()}/>
      {activities.length>0 ? (
      <>
      <ActivityList/>
        {pagination? <Button content="Load More" fluid  animated onClick={()=>handleGetNext()} loading={loadingNext} disabled={pagination.currentPage*pagination.itemsPerPage===pagination.totalItems}/>:null}
      </>
        ) : (
          <h1 style={{ textAlign: "center", marginLeft: 400 }}>
            No Activities
          </h1>
        )}
      </Grid.Column>
      <Grid.Column width="6" >
      <ActivityFilters/>
      </Grid.Column>
    </Grid>:<Redirect to='/'/>}
     
   </React.Fragment>
  );
};

export default observer(Activitydashboard);
