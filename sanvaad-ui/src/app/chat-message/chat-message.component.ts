import { Component, OnInit, Input } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { User } from '../dataModels/User';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.sass']
})
export class ChatMessageComponent implements OnInit {

  @Input() msg: Message;

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
