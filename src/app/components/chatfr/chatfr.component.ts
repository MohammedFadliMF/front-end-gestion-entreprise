import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { finalize } from 'rxjs';
import { Company } from 'src/app/interfaces/company';
import { User } from 'src/app/interfaces/user';
import { ChatfrService, Message } from 'src/app/services/chatfr.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-chatfr',
  templateUrl: './chatfr.component.html',
  styleUrls: ['./chatfr.component.css'],
})
export class ChatfrComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  current_user!: User;
  current_company!: Company;
  current_room!: string;

  message = '';
  messages: any[] = [];
  extract_messages: any[] = [];
  rooms!: any[];
  users!: any;

  constructor(
    private chatService: ChatfrService,
    private companyService: CompanyService
  ) {
    const user = window.localStorage.getItem('current_user');
    const cmp = window.localStorage.getItem('CurrentCompany');
    if (user && cmp) {
      this.current_user = JSON.parse(user);
      this.current_company = JSON.parse(cmp);
    }
  }
  isImage(fileUrl: string): boolean {
    console.log('fileUrl :> '+ fileUrl);
    
    return /\.(jpeg|jpg|gif|png)$/i.test(fileUrl);
  }
  ngOnInit(): void {
    this.chatService
      .getRoomsByUser(this.current_company, this.current_user)
      .subscribe((rooms) => {
        this.rooms = rooms;
        console.log(this.rooms);
      });

    // this.chatService.getRooms(this.current_company).subscribe((rooms) => {
    //   this.rooms = rooms;
    // });

    this.companyService.getAllUsersInCompany().subscribe((users) => {
      this.users = users;
    });
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  createCompany(chatRoom: string) {
    this.chatService.createCompany(this.current_company, chatRoom);
  }
  createRoom(chatRoom: string) {
    this.chatService.addRoom(this.current_company, chatRoom);
  }

  sendMessageToRoom(): void {
    if (this.message.trim() !== '') {
      let message: Message = {
        content: this.message,
        senderId: this.current_user.userId,
        senderName: this.current_user.username,
        createAt: new Date(),
        isFile: false,
      };
      this.chatService.sendMessageToGroup(
        this.current_company,
        message,
        this.current_room
      );
      this.message = '';
    }
  }

  removeMessage(messageId: string) {
    this.chatService.removeMessage(
      this.current_company,
      this.current_room,
      messageId,
      this.current_user
    );
    console.log('Messsage was deleted : ' + messageId);
  }

  selectRoom(room: string) {
    this.current_room = room;
    this.chatService
      .getMessagesRoom(this.current_company, this.current_room)
      .subscribe((messages) => {
        this.messages = messages;
        this.extract_messages = this.getFormattedMessages(this.messages);
        //console.log(this.extract_messages.length);
      });
  }
  getFormattedMessages(rawMessages: Message[]): any[] {
    const formattedMessages: any = [];
    let lastDate = '';

     rawMessages.forEach((message) => {
       const messageDate = this.convertTimestampToDate(message.createAt);
       const messageDateString = messageDate.toLocaleDateString();

       if (messageDateString !== lastDate) {
         formattedMessages.push({ type: 'separator', date: messageDateString });
         console.log('messageDate: ' + messageDateString);

         lastDate = messageDateString;
       }

       formattedMessages.push({
         type: 'message',
         message: {
           ...message,
           createAt: this.extractTime(messageDate),
         },
       });
     });
    return formattedMessages;
  }
  extractTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }
  convertTimestampToDate(timestamp: any): Date {
    if (
      timestamp &&
      timestamp.seconds !== undefined &&
      timestamp.nanoseconds !== undefined
    ) {
      // Handle Firebase Timestamp
      return new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );
    } else if (typeof timestamp === 'string' || timestamp instanceof Date) {
      // Handle normal date string or Date object
      return new Date(timestamp);
    } else {
      console.error('Invalid timestamp format:', timestamp);
      return new Date(); // Return current date as fallback
    }
  }

  uploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const path = `companies/${this.current_company.companyId}/rooms/${this.current_room}/files`;
      this.chatService
        .uploadFile(file, path)
        .pipe(
          finalize(() => {
            this.chatService.storage
              .ref(path + '/' + file.name)
              .getDownloadURL()
              .subscribe((url) => {
                const message: Message = {
                  // content: `File: <a href="${url}" target="_blank">${file.name}</a>`,
                  content: url,
                  senderId: this.current_user.userId,
                  senderName: this.current_user.username,
                  createAt: new Date(),
                  isFile: true,
                };
                this.chatService.sendMessageToGroup(
                  this.current_company,
                  message,
                  this.current_room
                );
              });
          })
        )
        .subscribe();
    }
  }
  // uploadFile(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     const file = input.files[0];
  //     const path = `companies/${this.current_company.companyId}/rooms/${this.current_room}/files`;
  //     this.chatService
  //       .uploadFile(file, path)
  //       .pipe(
  //         finalize(() => {
  //           this.chatService.storage
  //             .ref(path + '/' + file.name)
  //             .getDownloadURL()
  //             .subscribe((url) => {
  //                const message = {
  //                 content: url, // Storing the URL directly
  //                 senderId: this.current_user.userId,
  //                 senderName: this.current_user.username,
  //                 createAt: new Date().toLocaleTimeString(),
  //                 isFile: true, // Flag to indicate this is a file message
  //                 fileName: file.name, // Store file name for display
  //               };
  //               this.chatService.sendMessageToGroup(
  //                 this.current_company,
  //                 message,
  //                 this.current_room
  //               );
  //             });
  //         })
  //       )
  //       .subscribe();
  //   }
  // }
}
