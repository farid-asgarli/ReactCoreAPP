import { makeAutoObservable } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { history } from "../..";

export default class UserStore {
  user: User | null = null;
  fbAcccessToken:string|null = null;
  fbLoading:boolean=false;
  refreshTokenTimeout:any;

  constructor() {
    makeAutoObservable(this);   
  }

  get isLoggedIn() {
    return !!this.user; //if the user is not null in return true, else false
  }

  setUser = (user: User | null) => (this.user = user);
  setFbLoading = (fbLoading :boolean) => (this.fbLoading = fbLoading);
  setFbAccessToken = (token :string) => (this.fbAcccessToken = token);


  register = async (credentials: UserFormValues) => {
    try {
      // const user = await agent.Account.register(credentials);
      // store.commonStore.setToken(user.token);
      // this.startRefreshTokenTimer(user);
      // this.setUser(user);
      //  history.push("/activities");

      await agent.Account.register(credentials);
      history.push(`/account/registerSuccess?email=${credentials.email}`)
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  login = async (credentials: UserFormValues) => {
    try {
      const user = await agent.Account.login(credentials);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.setUser(user);
      store.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.token = null;
    localStorage.removeItem("jwt");
    this.setUser(null);
    store.activityStore.setActivities([]);
    history.push("/");
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      store.commonStore.setToken(user.token);
      this.setUser(user);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  setImage = (image: string) => {
    if (this.user) {
      return (this.user.image = image);
    }
  };

  getFacebookLoginStatus = async () => {
    window.FB.getLoginStatus(response=>{
      // console.log(response);
      if(response.status==='connected'){
        this.setFbAccessToken(response.authResponse.accessToken);
      }
    })
  }

  facebookLogin = () => {
    this.setFbLoading(true);

    const apiLogin = (accessToken:string) => {
      agent.Account.fbLogin(accessToken).then((user:User)=>{
        store.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        this.setUser(user);
        this.setFbLoading(false);
        history.push('/activities');
      }).catch(error=>{
        console.log(error)
        this.setFbLoading(false);
      });
    }


    if(this.fbAcccessToken){
      apiLogin(this.fbAcccessToken);
    }else{
      window.FB.login(response=>{
        apiLogin(response.authResponse.accessToken)
      },{scope:'public_profile,email'})
    }
  };

  refreshToken = async () => {
    this.stopRefreshTokenTimeout();
    try {
      const user = await agent.Account.refreshToken();
      this.setUser(user);

      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  }

  private startRefreshTokenTimer(user:User){
    const jwtToken =JSON.parse(atob(user.token.split('.')[1]));
    const expires = new Date(jwtToken.exp*1000);
    const timeout = expires.getTime()-Date.now()-(30*1000);
    // console.log(timeout);
    this.refreshTokenTimeout =setTimeout(this.refreshToken,timeout);
  }

  private stopRefreshTokenTimeout() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
