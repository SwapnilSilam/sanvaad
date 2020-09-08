import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { User } from '../dataModels/User';
import { SignalHandlerService } from '../services/signal-handler.service';

@Component({
  selector: 'app-show-participants-dialog',
  templateUrl: './show-participants-dialog.component.html',
  styleUrls: ['./show-participants-dialog.component.sass']
})
export class ShowParticipantsDialogComponent implements OnInit {

  triggerElementRef: ElementRef;
  users: User[] = [];
  roomId: string;

  constructor(private dialogRef: MatDialogRef<ShowParticipantsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { trigger: ElementRef, roomId: string }, public signalRService: SignalHandlerService) {
    this.triggerElementRef = data.trigger;
    this.roomId = data.roomId;
  }

  ngOnInit() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    matDialogConfig.position = { left: `${rect.left}px`, top: `${rect.bottom - 450}px` };
    matDialogConfig.width = '300px';
    matDialogConfig.height = '400px';
    this.dialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this.dialogRef.updatePosition(matDialogConfig.position);

    this.signalRService.startConnection(null);
    this.signalRService.listenGetPaticipantsList(this.onParticipantListReceived.bind(this));
    this.signalRService.invokeGetPaticipantsList(this.roomId);
  }

  onParticipantListReceived(participants: User[]) {
    this.users = participants;
  }

  public setUserName() {
    this.dialogRef.close();
  }
}
