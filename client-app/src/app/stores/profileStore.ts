import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { Photo, Profile, ProfileFormValues, UserActivity } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading: boolean = false;
  loading: boolean = false;
  updating:boolean=false;
  followings:Profile[] =[]; //can either be followers or the people you follow, does not matter
  loadingFollowings:boolean= false;
  userActivities :UserActivity[]=[];
  loadingUserActivities:boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingProfile = (loading: boolean) => {
    this.loadingProfile = loading;
  };

  setProfile = (profile: Profile | null) => {
    this.profile = profile;
  };

  setUploading = (uploading: boolean) => {
    this.uploading = uploading;
  };

  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  setLoadingUserActivities = (loadingUserActivities: boolean) => {
    this.loadingUserActivities = loadingUserActivities;
  };

  setUpdating = (updating: boolean) => {
    this.updating = updating;
  };

  setLoadingFollowings = (loadingFollowings: boolean) => {
    this.loadingFollowings = loadingFollowings;
  };
  setFollowings = (followings: Profile[]) => {
    this.followings = followings;
  };
  
  setUserActivities = (userActivities: UserActivity[]) => {
    this.userActivities = userActivities;
  };
  loadProfile = async (username: string) => {
    this.setLoadingProfile(true);
    try {
      const profile: Profile = await agent.Profiles.get(username);
      this.setProfile(profile);
      this.setLoadingProfile(false);
    } catch (error) {}
  };

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  uploadPhoto = async (file: Blob) => {
    this.setUploading(true);
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.setUploading(false);
      });
    } catch (error) {
      console.log(error);
      this.setUploading(false);
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.setLoading(true);
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((x) => x.isMain)!.isMain = false;
          this.profile.photos.find((x) => x.id === photo.id)!.isMain = true;

          this.profile.image = photo.url;
          this.setLoading(false);
          store.activityStore.loadActivities();
        }
      });
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  };

  deletePhoto = async (photo: Photo) => {
    if (photo.isMain) {
      toast.error("You can not delete the Main photo");
      return;
    } else {
      this.setLoading(true);
      try {
        await agent.Profiles.deletePhoto(photo.id);
        runInAction(() => {
          if (this.profile && this.profile.photos) {
            this.profile.photos = this.profile.photos.filter(
              (x) => x.id !== photo.id
            );
            this.setLoading(false);
          }
        });
      } catch (error) {
        console.log(error);
        this.setLoading(false);
      }
    }
  };

  updateProfile = async (profileFormValues:ProfileFormValues)=>{
      if(store.userStore.user&&this.profile&&this.profile?.username===store.userStore.user.username){
        this.setUpdating(true);
        try {
          await agent.Profiles.updateProfile(profileFormValues);
          const updatedValues={
            bio:profileFormValues.bio,
           displayName: profileFormValues.displayName
          }
          
          store.userStore.setUser({...store.userStore.user,displayName:profileFormValues.displayName})
          this.setProfile({...this.profile,...updatedValues} as Profile)
          this.setUpdating(false);
          store.activityStore.loadActivities();
          

        } catch (error) {
          console.log(error);
          this.setUpdating(false);
        }
        
      }
      else{
       toast.error("You can not edit this profile")
      }
  }



  
  updateFollowing = async(username:string,isFollowing:boolean)=>{
    this.loading=true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
     runInAction(()=>{
      if(this.profile && this.profile.username!==store.userStore.user?.username && this.profile.username===username) //when visiting the user profile
      {
        // isFollowing?this.profile.followersCount++:this.profile.followersCount--; // Neils's method, remove the line below
        this.profile.isFollowing?this.profile.followersCount--:this.profile.followersCount++;
        this.profile.isFollowing=!this.profile.isFollowing;
      }

      this.followings.forEach(profile=>{ //for updating the users in the followers tab
        if(profile.username===username){
          profile.isFollowing? profile.followersCount -- :profile.followersCount++
          profile.isFollowing =!profile.isFollowing;
        }
      })
      
      if(this.profile&&this.profile.username===store.userStore.user?.username)
      {
        this.followings.forEach(profile=>{ //for updating the users in the following tab
          if(profile.username===username){
            profile.isFollowing? this.profile!.followingsCount ++ :this.profile!.followingsCount--
            // profile.isFollowing =!profile.isFollowing;
          }
        })
      }

      this.setLoading(false);
     })
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  }

  loadFollowings = async (predicate:string) => {
    this.setLoadingFollowings(true);

    try {
      const followings= await agent.Profiles.listFollowing(this.profile!.username,predicate);

      this.setFollowings(followings);

      this.setLoadingFollowings(false);
    } catch (error) {
        console.log(error)
      this.setLoadingFollowings(false);

    }
  }

    loadUserActivities = async (username:string, predicate?:string)=>{
        this.setLoadingUserActivities(true);
        try {
          const userActivities = await agent.Profiles.listUserActivities(username,predicate!);
          this.setUserActivities(userActivities);
          this.setLoadingUserActivities(false);

        } catch (error) {
          console.log(error);
          this.setLoadingUserActivities(false);

        }
    }










}

