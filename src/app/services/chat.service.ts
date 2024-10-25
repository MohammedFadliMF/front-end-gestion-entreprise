import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ChatRoomDTO } from '../interfaces/chat-room-dto';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url: string = 'http://localhost:8585' + '/' + 'chats/';
  private options?: any;
  public companyId!: number;
  token:any;

  constructor(private http: HttpClient) {
     this.token = window.localStorage.getItem('jwt-token');
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };
    // this.companyId=this.auth.selectedCompany.companyId;
    const selected = window.localStorage.getItem('CurrentCompany');
    if (selected) {
      this.companyId = JSON.parse(selected).companyId;
      // console.log('comapny Id :' + this.companyId);
    }
  }
  

  public getAllChatsInCompany() {
    return this.http.get(`${this.url}${this.companyId}`, this.options);
    // .pipe(catchError(this.handleError<Chat[]>('getting all chats', [])));
  }

  public createChat(request: RequestCreateChat) {
    return this.http.post(this.url, request, this.options);
  }
}

// export interface ChatRoomDTO{
//    chatId:number;
//    chatName:string;
// }
export interface RequestCreateChat {
  chatName: string;
  company: {
    companyId:number;
    companyName: string;
  };
}
// export interface CreateCompany {
//   company: {
//     companyName: string;
//   };
//   permission: string;
// }


export interface req {
    companyName: string;
}


