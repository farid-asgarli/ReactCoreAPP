import { ChatComment } from "../models/comment";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr"
import { makeAutoObservable } from "mobx";
import { store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  setComments = (comments: ChatComment[]) => {
    this.comments = comments;
  };
  
  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_CHAT_URL}?activityId=${activityId}`, {
          accessTokenFactory: () => store.userStore.user?.token!,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
      this.hubConnection
        .start()
        .catch((error) =>
          console.log("Error establishing the connection", error)
        );

      this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {

        comments.forEach(x=>x.createdAt=new Date(x.createdAt+"Z"))
        this.setComments(comments);
      });
      this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
        comment.createdAt = new Date(comment.createdAt);
        this.setComments([...this.comments,comment]);
      });
    }
  };

  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((error) => console.log("Error stopping the connection", error));
  };

  clearComments = () => {
    this.setComments([]);
    this.stopHubConnection();
  };

  addComment = async (values:any) => {
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
        await this.hubConnection?.invoke("SendComment", values)
    } catch (error) {
        console.log(error)
    }   
  }
}

