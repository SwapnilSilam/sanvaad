import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meeting-details-dialog',
  templateUrl: './meeting-details-dialog.component.html',
  styleUrls: ['./meeting-details-dialog.component.sass']
})
export class MeetingDetailsDialogComponent implements OnInit {

  triggerElementRef: ElementRef;
  roomId: string;
  meetingUrl: string;

  constructor(private dialogRef: MatDialogRef<MeetingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { trigger: ElementRef, roomId: string }, private _snackBar: MatSnackBar) {
    this.triggerElementRef = data.trigger;
    this.roomId = data.roomId;
  }

  ngOnInit() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    matDialogConfig.position = { left: `${rect.left}px`, top: `${rect.bottom - 200}px` };
    matDialogConfig.width = '400px';
    matDialogConfig.height = '150px';
    this.dialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this.dialogRef.updatePosition(matDialogConfig.position);
    this.meetingUrl = `${location.origin}/join/${this.roomId}`;
  }

  copy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this._snackBar.open("Copied", "", {
      duration: 1000
    });
  }
}
