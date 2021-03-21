import { User } from "./user";

export interface Profile{
    username:string;
    displayName:string;
    image?:string;
    bio?:string;
    photos?:Photo[];
    followersCount:number;
    followingsCount:number;
    isFollowing:boolean
}

export class Profile implements Profile{
    constructor(user:User){
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}


export interface Photo{
    id:string;
    url:string;
    isMain:boolean;
}


export class ProfileFormValues {
    
    displayName:string='';
    bio?:string|undefined=undefined;
    
    constructor(initialValue?:ProfileFormValues){
       if(initialValue){
        this.bio=initialValue.bio;
        this.displayName=initialValue.displayName;
       }
        
    }
}

export interface UserActivity {
  id: string;
  title: string;
  category: string;
  createdAt: Date;
}