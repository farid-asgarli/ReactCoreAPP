import { Activity, ActivityFormValues } from "../models/activity";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  editMode: boolean = false;
  loading: boolean = false;
  loadingInitial: boolean = true;
  pagination:Pagination|null= null;
  pagingParams = new PagingParams();
  filterParams = new Map().set('all',true);


  constructor() {
    makeAutoObservable(this);
    reaction(
      ()=>this.filterParams.keys(),
      ()=>{
        this.setLoadingInitial(true);
        this.setPagingParams(new PagingParams());
        this.setActivities([]);
        // this.loadActivities();
      }
    )
  }

  setActivities = (activities: Activity[]) => (this.activities = activities);

  setLoadingInitial = (loadingInitial: boolean) =>
    (this.loadingInitial = loadingInitial);

  setSelectedActivity = (activity: Activity | undefined) => {
    this.selectedActivity = activity;
  };
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };
  setPagination = (pagination:Pagination) => {
    this.pagination = pagination;
  }
  setPagingParams = (pagingParams:PagingParams) => {
    this.pagingParams = pagingParams;
  }

  setFilterParams= (filterParams:string, value:string|Date) => {
    const resetFilterParams = () => {
      this.filterParams.forEach((value, key)=>{
        if(key!=="startDate") {
          this.filterParams.delete(key);
        }
      })
    }
    
    switch (filterParams) {
      case "all":
        resetFilterParams();
        this.filterParams.set("all", true);
        break;
      case "isGoing":
        resetFilterParams();
        this.filterParams.set("isGoing", true);
        break;
      case "isHost":
        resetFilterParams();
        this.filterParams.set("isHost", true);
        break;
      case "startDate":
        this.filterParams.delete('startDate');
        this.filterParams.set('startDate',value);
        break;
    }
  }

  get axiosParams (){
    const params = new URLSearchParams();
    params.append('pageNumber',this.pagingParams.pageNumber.toString());
    params.append('pageSize',this.pagingParams.pageSize.toString());
    this.filterParams.forEach((value, key)=>{
      if(key==="startDate"){
        params.append(key,(value as Date).toISOString());
      }else{
        params.append(key, value);
      }
    })
    return params;
  }

  loadActivities = async () => {
    // this.setLoadingInitial(true);
    console.log(true)
    try {
      const result = await agent.Activities.list(this.axiosParams); // yes, result because we return the type paginatedResult here. We shall extract activities and pagination data from the result.
      result.data.forEach((activity) => this.setActivity(activity));
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };
 
  refreshActivities = () => {
    this.setLoadingInitial(true);
    this.setPagingParams(new PagingParams()); //for loading from the scratch
    this.filterParams.forEach((value, key)=>{
      this.filterParams.delete(key);
    })
    this.setActivities([]); //useEffect takes care of it in the ActivityDashboard.
  }


  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.setSelectedActivity(activity);
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.setSelectedActivity(activity);
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private getActivity = (id: string)  => {
    return this.activities.find((a) => a.id === id);
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }

    activity.date = new Date(activity.date!);
    this.setActivities([...this.activities, activity]);
  };

  get activitiesByDate() {
    return Array.from(this.activities.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date!.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        //Here      date   =   activities of that date
        //Output    2021-01-10 : [activities of that date]

        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  setEditMode = (editMode: boolean) => {
    this.editMode = editMode;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      
      await agent.Activities.create(activity);

      const newaActivity =  new Activity(activity);
      newaActivity.attendees = [attendee];
      newaActivity.host = attendee;
      newaActivity.hostUsername  = user?.username;    

      this.setActivity(newaActivity);
      this.setSelectedActivity(newaActivity);
    } catch (error) {

      console.log(error);

    }
  };

  updateActivity = async (activityFormValues: ActivityFormValues) => {
    this.setLoading(true);
    try {
      await agent.Activities.update(activityFormValues);
      if(activityFormValues.id){
        let updatedActivity ={...this.getActivity(activityFormValues.id),...activityFormValues};
         this.setActivities([...this.activities.filter(x=>x.id!==activityFormValues.id),updatedActivity as Activity]); // we are casting the updatedActivity as Activity here, as it can not be detected automaticaly by ts.
         this.setSelectedActivity(updatedActivity as Activity);

      }
    } catch (error) {
     
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.setLoading(true);
    await agent.Activities.delete(id);
    this.setActivities([...this.activities.filter((a) => a.id !== id)]);
    this.setLoading(false);
    if (this.selectedActivity?.id === id) {
      this.setSelectedActivity(undefined);
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.setLoading(true);
    try {

      await agent.Activities.attend(this.selectedActivity!.id);
     runInAction(()=>{
      if(this.selectedActivity?.isGoing){
        this.selectedActivity.attendees  = this.selectedActivity.attendees?.filter(a=>a.username !== user?.username);
        this.selectedActivity.isGoing =false;
      }else{
        const attendee: Partial<Profile> = {
          displayName: user?.displayName!,
          username: user?.username!,
          image: user?.image,

        };
        this.selectedActivity?.attendees?.push(attendee as Profile);
        this.selectedActivity!.isGoing=true;
      }
      this.setActivities([...this.activities.filter(a=>a.id!==this.selectedActivity?.id),this.selectedActivity!]);
     })

    } catch (error) {
      console.log(error);
    } finally {
      this.setLoading(false);
    }
  };


  cancelActivityToggle=async() => {

    this.setLoading(true);

    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(()=>{
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.setActivities([...this.activities.filter(x=>x.id!==this.selectedActivity!.id),this.selectedActivity!]);
        this.setLoading(false);
      })

    } catch (error) {
      console.log(error)
    }finally{
      this.setLoading(false);
    }
  }

  clearSelectedActivity =() => { //for clearing out the activity when we leave that page, so signalr will not be throwing an error.
    this.selectedActivity = undefined;
  }

  updateAttendeeFollowing = (username:string)=>{  //for attendees in the list of activities
    this.activities.forEach(activity=>{
      activity.attendees.forEach(attendee=>{
        if(attendee.username===username){
          attendee.isFollowing?attendee.followersCount--:attendee.followersCount++;
          attendee.isFollowing=!attendee.isFollowing;
        }
      })
    })
  }
}
