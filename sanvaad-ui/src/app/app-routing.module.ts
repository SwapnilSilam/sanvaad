import { VideoChatComponent } from './video-chat/video-chat.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'create-room', component: CreateRoomComponent },
  { path: 'join/:meetingId', component: VideoChatComponent },
  { path: '',   redirectTo: '/create-room', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
