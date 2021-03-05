import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr'
import { environment } from 'src/environments/environment';
import { Message } from '../dataModels/Message';
import { User } from '../dataModels/User';

@Injectable({
  providedIn: 'root'
})

export class SignalHandlerService {

  private isServiceStarted: boolean = false;

  constructor() { }

  private hubConnection: signalR.HubConnection;

  public startConnection = (method: Function) => {

    if (this.isServiceStarted) {
      if (method !== null) {
        method();
      }
    }
    else {
      this.hubConnection = new SignalR.HubConnectionBuilder()
        .withUrl(environment.signalRUrl)
        .build();

      this.hubConnection
        .start()
        .then(() => {
          this.isServiceStarted = true;
          if (method !== null) {
            method();
          }
          console.log("Connection established successfully!")
        })
        .catch(error => console.log(error))
    }
  };

  public stopConnection = () => {
    this.isServiceStarted = false;
    this.hubConnection.stop().then(() => { console.log("Connection Closed!") }).catch(error => console.log(error));
  }

  public disConnection = () => {
    this.hubConnection.onclose(error => { console.log("Disconncted from call.") });
  }

  public listenReceiveMessage = (method: Function) => {
    this.hubConnection.on("ReceiveMessage", (data: Message) => {
      if (method !== null) {
        method(data);
        console.log("Message received and method executed.", data);
      } else {
        console.log("Message received and method not executed.", data);
      }
    })
  };

  public invokeSendMessageToAll = (roomId: string, data: Message) => {
    this.hubConnection.invoke("SendMessageToAll", roomId, data)
      .then(() => { console.log("Data broadcasted successfully!") })
      .catch(error => console.log(error))
  }

  public listenJoinedRoom = (method: Function) => {
    this.hubConnection.on("JoinedRoom", (roomId, userId, displayName) => {
      if (method !== null) {
        method(roomId, userId, displayName);
      }
    })
  };

  public invokeJoinedRoom = (roomId: string, userId: string, displayName: string) => {
    this.hubConnection.invoke("JoinedRoom", roomId, userId, displayName)
      .then(() => { console.log("Data broadcasted successfully!") })
      .catch(error => console.log(error))
  }

  public listenUserLeftRoom = (method: Function) => {
    this.hubConnection.on("LeftRoom", (roomId, userId) => {
      if (method !== null) {
        method(roomId, userId);
      }
    })
  }

  public listenGetSelfDetails = (method: Function) => {
    this.hubConnection.on("GetSelfDetails", (user: User) => {
      if (method !== null) {
        method(user);
        console.log("Received get self details and method executed.", user);
      } else {
        console.log("Received get self details and method not executed.", user);
      }
    })
  }

  public invokeGetSelfDetails = () => {
    this.hubConnection.invoke("GetSelfDetails")
      .then(() => { console.log("Trying to get self details successfully!") })
      .catch(error => console.log(error))
  }

  public listenGetRemoteUserDetails = (method: Function) => {
    this.hubConnection.on("GetRemoteUser", (userName: string, userId: string) => {
      if (method !== null) {
        method(userName, userId);
      }
    })
  }

  public invokeGetRemoteUserDetails = (userId) => {
    this.hubConnection.invoke("GetRemoteUser", userId)
      .then(() => { console.log("Data broadcasted successfully!") })
      .catch(error => console.log(error))
  }

  public listenGetPaticipantsList = (method: Function) => {
    this.hubConnection.on("PaticipantsList", (users: User[]) => {
      if (method !== null) {
        method(users);
      }
    })
  }

  public invokeGetPaticipantsList = (roomId: string) => {
    this.hubConnection.invoke("PaticipantsList", roomId)
      .then(() => { console.log("Data broadcasted successfully!") })
      .catch(error => console.log(error))
  }

  public invokeAddScreenSharingModality = (roomId: string, userId: string, screenSharingCallId: string) => {
    this.hubConnection.invoke("AddScreenSharingModality", roomId, userId, screenSharingCallId)
      .then(() => { console.log("Data broadcasted successfully!") })
      .catch(error => console.log(error))
  }

  public listenScreenSharingStatus = (method: Function) => {
    this.hubConnection.on("ScreenSharingStatus", (status: string, userName: string) => {
      if (method !== null) {
        method(status, userName);
      }
    })
  }

  public listenScreeenSharingStatusWithUserList = (method: Function) => {
    this.hubConnection.on("ScreeenSharingStatusWithUserList", (userIds: string[], status: string) => {
      if (method !== null) {
        method(userIds, status);
      }
    })
  }

  public invokeScreenSharingStatus = (roomId: string, userId: string, status: string, userName: string) => {
    this.hubConnection.invoke("ScreenSharingStatus", roomId, userId, status, userName)
      .then(() => { console.log("Data broadcasted successfully!") })
      .catch(error => console.log(error))
  }
}
