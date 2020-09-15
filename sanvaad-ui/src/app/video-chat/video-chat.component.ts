// IF you get issue for starting server of peer by saying
// "You cannot run this script on the current system. For more information about running scripts and setting execution policy"
// Then you need to run you PowerShell in admin mode and then execute following commands
// PS> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
// Or PS> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine

import { Component, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { environment } from './../../environments/environment';
import { SignalHandlerService } from '../services/signal-handler.service';
import { PeerConnections } from '../dataModels/PeerConnections';
import { GetUsernameDialogComponent } from '../get-username-dialog/get-username-dialog.component';
import { ShowParticipantsDialogComponent } from '../show-participants-dialog/show-participants-dialog.component';
import { MeetingDetailsDialogComponent } from '../meeting-details-dialog/meeting-details-dialog.component';

declare var Peer: any;

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.sass']
})
export class VideoChatComponent implements OnInit {

  private meetingId: string;
  private localUserPeer: any;
  private localUserId: string;
  public localUserStream: MediaStream;
  public localUserCallObject: any;
  public isVideoEnabled: boolean = false;
  public isMute: boolean = false;
  public remoteUserCall: any;
  public userDisplayName: string;
  public avContraints: any = { audio: true, video: { width: { exact: 640 }, height: { exact: 480 } } };
  private connections: Array<PeerConnections> = new Array();
  private remoteConnectionIds: Array<string> = new Array();
  constructor(private renderer: Renderer2, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, public signalRService: SignalHandlerService) { }

  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.meetingId = params.get("meetingId");
    });

    this.openSetUserNameDialog();
  }

  openSetUserNameDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(GetUsernameDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => this.onUserDisplayNameReceived(data)
    );
  }

  openGetPaticipantListDialog(evt: MouseEvent) {

    const target = new ElementRef(evt.currentTarget);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { trigger: target, roomId: this.meetingId };
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(ShowParticipantsDialogComponent, dialogConfig);
  }

  openMeetingDetailsDialog(evt: MouseEvent) {

    const target = new ElementRef(evt.currentTarget);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { trigger: target, roomId: this.meetingId };
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(MeetingDetailsDialogComponent, dialogConfig);
  }

  public onUserDisplayNameReceived(userName: string) {
    this.userDisplayName = userName;
    this.signalRService.startConnection(this.onSuccessfullConnection.bind(this));
    this.signalRService.listenJoinedRoom(this.connectToOtherUsers.bind(this));
    this.signalRService.listenUserLeftRoom(this.remoteUserLeft.bind(this));
    this.signalRService.listenGetRemoteUserDetails(this.onRemoteUserDetails.bind(this));
  }

  async onSuccessfullConnection() {
    this.localUserPeer = this.getPeerObject();
    this.localUserPeer.on('open', this.sendNotificationOfJoining.bind(this));
    this.localUserPeer.on('call', this.onCallReceive.bind(this));
    await this.GetUserDevices();
  }

  getPeerObject(): any {
    return new Peer(undefined, {
      path: environment.peerPath,
      host: environment.peerHost,
      port: environment.peerPort
    });
  }

  sendNotificationOfJoining(id: any) {
    this.localUserId = id;
    this.signalRService.invokeJoinedRoom(this.meetingId, id, this.userDisplayName);
  }

  async onCallReceive(call: any) {
    const stream = await navigator.mediaDevices.getUserMedia(this.avContraints);
    this.remoteUserCall = call;

    this.localUserStream = stream;
    const peerConnection = this.connections.filter(item => item.UserId == this.localUserId);
    if (peerConnection.length == 1) {
      peerConnection[0].VideElement.srcObject = this.localUserStream;
    }

    call.answer(stream);
    call.on('stream', ((stream: any) => this.onStream(stream, call)).bind(this));
  }

  onStream(stream: any, call: any) {
    if (this.remoteConnectionIds.indexOf(call.peer) == -1) {
      this.remoteConnectionIds.push(call.peer);
      this.signalRService.invokeGetRemoteUserDetails(call.peer);
      this.addUser(stream, call.peer, call, "", false);
    }
  }

  onRemoteUserDetails(userName: string, userId: string) {
    const peerConnection = this.connections.filter(item => item.UserId == userId);
    if (peerConnection.length == 1) {
      peerConnection[0].DivElement.childNodes[0].textContent = userName;
    }
  }

  onReceiveRemoteUserStream(stream: any, userId: string, callObject: any, displayName: string) {
    if (this.remoteConnectionIds.indexOf(userId) == -1) {
      this.remoteConnectionIds.push(userId);
      this.addUser(stream, userId, callObject, displayName, false);
    }
  }

  onRemoteUserClosed(userId: string) {
    const peerConnection = this.connections.filter(item => item.UserId == userId);
    if (peerConnection.length == 1) {
      this.renderer.removeChild(this.videoContainer.nativeElement, peerConnection[0].DivElement);
      const index = this.connections.indexOf(peerConnection[0], 0);
      this.connections.splice(index, 1);
    }
  }

  async GetUserDevices() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.avContraints);
      this.HandelSucess(stream);
    }
    catch (exception) {
      this.HandelError(exception);
    }
  }

  HandelSucess(stream: MediaStream) {
    const videoTracks = stream.getVideoTracks();
    const constraints = videoTracks[0].getConstraints();

    this.localUserStream = stream;
    this.addUser(this.localUserStream, this.localUserId, null, this.userDisplayName, true);
  }

  connectToOtherUsers(roomId: string, userId: string, displayName: string) {
    if (roomId == this.meetingId && userId != this.localUserId) {
      this.localUserCallObject = this.localUserPeer.call(userId, this.localUserStream);
    }

    if (this.localUserCallObject) {
      this.localUserCallObject.on('stream', ((stream: any) => this.onReceiveRemoteUserStream(stream, userId, this.localUserCallObject, displayName)).bind(this), (error) => { console.log("Error during receiving stream", error) });
      this.localUserCallObject.on('close', (() => this.onRemoteUserClosed(userId)).bind(this));
    }
  }

  remoteUserLeft(roomId: string, userId: string) {
    const peerConnection = this.connections.filter(item => item.UserId == userId);
    if (peerConnection.length == 1) {
      peerConnection[0].CallObject.close();
    }
  }

  HandelError(error: MediaStreamError) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = this.avContraints.video;
      this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`, error);
    } else if (error.name === 'PermissionDeniedError') {
      this.errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.', error);
    }
    this.errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  errorMsg(msg, error) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  addUser(stream: MediaStream, userId: string, callObject: any, userName: string, isLocalPaticipant : boolean) {
    const videoElement = this.GetNewVideoElement();
    videoElement.muted = isLocalPaticipant;
    videoElement.srcObject = stream;

    this.isVideoEnabled = stream.getVideoTracks()[0].enabled;
    this.isMute = this.localUserStream.getAudioTracks()[0].enabled;

    const divElement: HTMLDivElement = this.renderer.createElement('div');
    divElement.setAttribute('class', 'displayNameContainer');

    const spanElement: HTMLSpanElement = this.renderer.createElement('span');
    spanElement.innerText = `${userName}`;
    spanElement.setAttribute('class', 'displayName');

    divElement.appendChild(spanElement)
    divElement.appendChild(videoElement);

    const peerConnection = new PeerConnections();
    peerConnection.RoomId = this.meetingId;
    peerConnection.VideElement = videoElement;
    peerConnection.UserId = userId;
    peerConnection.CallObject = callObject;
    peerConnection.DivElement = divElement;
    this.connections.push(peerConnection);

    this.renderer.appendChild(this.videoContainer.nativeElement, divElement);
  }

  GetNewVideoElement() {
    const videoElement: HTMLVideoElement = this.renderer.createElement('video');
    videoElement.autoplay = true;
    videoElement.setAttribute('playsinline', '');
    videoElement.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
    return videoElement;
  }

  PlayStopVideo() {
    if (this.isVideoEnabled) {
      this.isVideoEnabled = this.localUserStream.getVideoTracks()[0].enabled = false;
    }
    else {
      this.isVideoEnabled = this.localUserStream.getVideoTracks()[0].enabled = true;
    }
  }

  muteUnmute() {
    if (this.isMute) {
      this.isMute = this.localUserStream.getAudioTracks()[0].enabled = false;
    }
    else {
      this.isMute = this.localUserStream.getAudioTracks()[0].enabled = true;
    }
  }

  endCall() {
    this.signalRService.stopConnection();
    this.router.navigate([`/create-room`]);
  }
}
