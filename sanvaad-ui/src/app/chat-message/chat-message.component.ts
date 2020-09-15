import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../dataModels/Message';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.sass']
})
export class ChatMessageComponent implements OnInit {

  @Input() msg: Message;

  constructor() { }

  ngOnInit() {
  }

}
