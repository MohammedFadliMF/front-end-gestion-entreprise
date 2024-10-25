import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatRoomDTO } from 'src/app/interfaces/chat-room-dto';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit {
  chats: any;
  selectedChat: any;

  constructor(private chatService: ChatService) {}
  ngOnInit(): void {
    // this.chatService.getAllChatsInCompany().subscribe({
    //   next: (data) => {
    //     this.chats = data;
    //   },
    // });
  }
  select(chat:any){
    this.selectedChat=chat;
    console.log("selected chat is :"+this.selectedChat.chatName);
  }
}
