import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../models/activity";
import { history } from "../../index";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { Photo, Profile, ProfileFormValues, UserActivity } from "../models/profile";
import { PaginatedResult } from "../models/pagination";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config=>{
  const token = store.commonStore.token;
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config;
})

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
   if(process.env.NODE_ENV === 'development'){
    await new Promise((resolve) =>
    setTimeout(() => {
      resolve(response);
    }, 1000)
  );
   }
    const pagination = response.headers['pagination'];
    if(pagination){
      console.log(pagination);
      //response un datasına ona görə müdaxilə olunub bu cür qaytarılır ki, onsuz da data ancaq activity lərdən ibarət olacaq, we only add the spice - pagination inside
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));
      return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status, statusText, config,headers } = error.response!;
    switch (status) {
      case 400:
        console.log(data);
        if(typeof data==='string'){
            toast.error(statusText);
        }
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const k in data.errors)
            if (data.errors[k]) {
              modalStateErrors.push(data.errors[k]);
            }
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        // console.log(data)
        if(status===401 && headers['www-authenticate']!=null && headers['www-authenticate'].startsWith('Bearer error="invalid_token"'))
        {
          store.userStore.logout();
          toast.error("Session Expired - please login again");

        }
        break;
      case 404:
        history.push("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push("/server-error");

        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};
//params in this context refers to the query, like sending an "{id}"
const Activities = {
  list: (pagingParams:URLSearchParams) => axios.get<PaginatedResult<Activity[]>>("/activities",{params:pagingParams}).then(responseBody), //this returns activities, meaning returns data, that is why get<Activities[]>
  create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity), //this does not return anything other than the status code, that is why post<void>
  update: (activity: ActivityFormValues) =>
    requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  attend:(id:string)=>requests.post<void>(`/activities/${id}/attend`,{})
};

const Account={
  current:()=> requests.get<User>('/account'),
  login:(user:UserFormValues)=>requests.post<User>("/account/login",user),
  register:(user:UserFormValues)=>requests.post<User>("/account/register", user),
  fbLogin:(accessToken:string)=>requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`,{}),
  refreshToken:()=>requests.post<User>("/account/refreshToken",{}),
  verifyEmail:(token:string, email:string)=>requests.post<void>(`/account/verifyEmail?token=${token}&email=${email}`,{}),
  resendEmailConfirmationLink:(email:string)=>requests.post<void>(`/account/resendEmailConfirmationLink?email=${email}`,{})
}

const Profiles={
  get:(username:string)=>requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto :(file:Blob) =>{
    let formData = new FormData();
    formData.append('File',file);
    return axios.post<Photo>('photos', formData,{
      headers:{'Content-type':'multipart/form-data'}
    })
  },
  setMainPhoto:(id:string)=>requests.post<void>(`/photos/${id}/setMain`,{}),
  deletePhoto:(id:string)=>requests.del<void>(`/photos/${id}`),
  updateProfile:(profile:ProfileFormValues)=>requests.put<void>(`/profiles`,profile),
  updateFollowing:(username:string)=>requests.post<void>(`/follow/${username}`,{}),
  listFollowing:(username:string, predicate:string)=>requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  listUserActivities:(username:string, predicate:string)=>requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
  Activities,
  Account,
  Profiles
};

export default agent;

//Sleep method v1
// const sleep=(delay:number)=>(response:AxiosResponse)=>new Promise<AxiosResponse>(resolve=>setTimeout(() => {
//   resolve(response)
// }, delay))

//Sleep method v2

// const sleep =(delay:number)=>new Promise(resolve=>{
//   setTimeout(resolve, delay)
// });

// ***********************************************************
// Demo 1

// const delay =()=> new Promise(resolve=>setTimeout(() => {
//   resolve(showDemo("Hello"))
// }, 3000));

// const fnc = async()=>{
//   await delay();
//   new Promise(resolve=>setTimeout(() => {
//     resolve(console.log('Finished'));
//   }, 3000))
// };

// fnc();

// ***********************************************************

//Demo 2

// const delay =()=> new Promise(resolve=>setTimeout(() => {
//   resolve(showDemo("Hello"))
// }, 3000));

// delay().then(()=>new Promise(resolve=>setTimeout(() => {
//   resolve(console.log('Finished'));
// }, 3000)))

// Demo 3

// const sleep =(delay:number)=>new Promise(resolve=>{
//   setTimeout(resolve, delay)
// });

// sleep(3000).then(()=>console.log("Həllou"));
