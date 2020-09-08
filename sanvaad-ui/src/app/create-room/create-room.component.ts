import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { v4 } from 'uuid';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.sass']
})
export class CreateRoomComponent implements OnInit {

  joinRoomForm: FormGroup;
  joinInput: FormControl = new FormControl('', [Validators.required]);

  public isMeetingURLCreated = false;
  public meetingUrl;
  constructor(private router: Router, private fb: FormBuilder) {
    this.joinRoomForm = this.fb.group({ joinInput: this.joinInput });
  }

  ngOnInit() {
  }

  createRoomId() {
    const meetingId = v4();
    this.meetingUrl = `${location.origin}/join/${meetingId}`;
    this.isMeetingURLCreated = true;
    this.router.navigate([`/join/${meetingId}`]);
  }

  public joinRoom() {
    if (!this.joinInput.hasError('required')) {
      this.router.navigate([`/join/${this.joinInput.value}`]);
    }
  }

}
