import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { GetUsernameDialogComponent } from './get-username-dialog/get-username-dialog.component';
import { ShowParticipantsDialogComponent } from './show-participants-dialog/show-participants-dialog.component';
import { MeetingDetailsDialogComponent } from './meeting-details-dialog/meeting-details-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoChatComponent,
    CreateRoomComponent,
    ChatWindowComponent,
    ChatMessageComponent,
    GetUsernameDialogComponent,
    ShowParticipantsDialogComponent,
    MeetingDetailsDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDialogModule,
    MatTooltipModule,
    MatListModule,
    MatSnackBarModule
  ],
  entryComponents: [
    GetUsernameDialogComponent,
    ShowParticipantsDialogComponent,
    MeetingDetailsDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
