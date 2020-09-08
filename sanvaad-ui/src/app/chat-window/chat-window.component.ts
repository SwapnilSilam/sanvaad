import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { v4 } from 'uuid';
import { Message } from '../dataModels/Message';
import { User } from '../dataModels/User';
import { SignalHandlerService } from '../services/signal-handler.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.sass']
})
export class ChatWindowComponent implements OnInit {

  messageControl: FormControl;
  chatForm: FormGroup;
  messages: Message[] = [];
  localUser: User;
  currentTime: number;

  constructor(private fb: FormBuilder, public signalRService: SignalHandlerService) {
    this.messageControl = new FormControl();
    this.chatForm = this.fb.group({ message: this.messageControl });
  }

  ngOnInit() {
    this.signalRService.startConnection(null);
    this.signalRService.listenReceiveMessage(this.pushMessage.bind(this));
    this.signalRService.listenGetSelfDetails(this.onReceiveSelfDetails.bind(this));
  }

  public onReceiveSelfDetails(user: User) {
    this.localUser = user;
  }

  submit() {
    const msg = this.messageControl.value;

    if (!msg) {
      return alert('Please enter a message.');
    }

    var message: Message = <Message>{
      content: msg,
      mid: v4(),
      user: this.localUser
    }

    this.pushMessage(message);
    this.messageControl.reset();
    this.signalRService.invokeSendMessageToAll(this.localUser.roomId, message);
  }

  public pushMessage(message: Message) {
    message.time = Date.now();
    console.log(message.time);
    this.messages.push(message);
    setTimeout(() => this.scrollBottom(), 500);
  }

  private scrollBottom() {
    var element = document.getElementById("message_container");
    element.scrollTop = element.scrollHeight;
  }
}
