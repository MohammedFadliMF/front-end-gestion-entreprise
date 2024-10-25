// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // private url: string = 'http://localhost:8585' + '/' + 'messages';
  // private options!: any;
  // private chatId!: number;
  // constructor(private http: HttpClient, private auth: AuthService) {
  //   this.options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${this.auth.accessToken}`,
  //     }),
  //   };
  // }
  // public getAllMessagesInChatRoom() {
  //   return this.http.get<MessageDTO[]>(
  //     `${this.url}${this.chatId}`,
  //     this.options
  //   );
  //   // .pipe(catchError(this.handleError<Chat[]>('getting all chats', [])));
  // }
}

export interface MessageDTO {
  messageId: number;
  content: string;
  timestamp: string;
  sender:any
}
