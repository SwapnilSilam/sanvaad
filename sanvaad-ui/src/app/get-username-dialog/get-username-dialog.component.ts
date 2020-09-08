import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-get-username-dialog',
  templateUrl: './get-username-dialog.component.html',
  styleUrls: ['./get-username-dialog.component.sass']
})
export class GetUsernameDialogComponent implements OnInit {

  setUserNameForm: FormGroup;
  displayNameInput: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<GetUsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit() {
    this.setUserNameForm = this.fb.group({ displayNameInput: this.displayNameInput });
  }

  public setUserName() {
    if (!this.displayNameInput.hasError('required')) {
      this.dialogRef.close(this.displayNameInput.value);
    }
  }
}
