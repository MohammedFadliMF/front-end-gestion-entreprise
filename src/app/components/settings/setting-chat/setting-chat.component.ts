import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Company } from 'src/app/interfaces/company';
import { User } from 'src/app/interfaces/user';
import { ChatfrService } from 'src/app/services/chatfr.service';
import { CompanyService } from 'src/app/services/company.service';
import { FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateChatComponent } from '../create-chat/create-chat.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-setting-chat',
  templateUrl: './setting-chat.component.html',
  styleUrls: ['./setting-chat.component.css'],
})
export class SettingChatComponent implements OnInit, AfterViewInit {
  toppings!: any;

  current_user!: User;
  current_company!: Company;
  rooms!: any[];
  current_room!: string;

  message = '';
  messages: any[] = [];
  users!: any;

  room_users!: User[];

  users_invited!: any[];
  dataSource!: any;

  constructor(
    private chatService: ChatfrService,
    private companyService: CompanyService,
    public dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    const user = window.localStorage.getItem('current_user');
    const cmp = window.localStorage.getItem('CurrentCompany');
    if (user && cmp) {
      this.current_user = JSON.parse(user);
      this.current_company = JSON.parse(cmp);
    }
  }
  ngOnInit(): void {
    this.chatService.getRooms(this.current_company).subscribe((rooms) => {
      this.rooms = rooms;
    });
    this.companyService.getAllUsersInCompany().subscribe((users) => {
      this.users = users;
    });
  }
  openDialog() {
    this.dialog.open(CreateChatComponent);
  }

  selectRoom(room: string) {
    this.current_room = room;
    this.chatService
      .getUsersFromRoom(this.current_company, this.current_room)
      .then((us) => {
        this.room_users = us;
        this.dataSource = new MatTableDataSource<User>(this.room_users);
      });
    console.log(this.room_users);

    // this.chatService
    //   .getMessagesRoom(this.current_company, this.current_room)
    //   .subscribe((messages) => {
    //     this.messages = messages;
    //   });
  }
  displayedColumns: string[] = ['userId', 'username', 'email', 'more'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // selectUser(room: string) {
  //   this.current_room = room;
  //   this.chatService
  //     .getMessagesRoom(this.current_company, this.current_room)
  //     .subscribe((messages) => {
  //       this.messages = messages;
  //     });
  // }
  addUsersToRoom() {
    this.chatService.addUsersToRoom(
      this.current_company,
      this.current_room,
      this.users_invited
    );
  }

  DeleteUserFromRoom(event: Event, user: User) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user from this conversation room?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeUser(user); // Call the remove method with the invoiceId
        // this.messageService.add({
        //   severity: 'info',
        //   summary: 'Confirmed',
        //   detail: 'Record deleted',
        //   life: 2000,
        // });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  removeUser(user: User) {
    this.chatService.removeUserFromRoom(
      this.current_company,
      this.current_room,
      user
    );
  }

  onSelectionChange($event: any): void {
    console.log('Selected users:', this.toppings);

    let users: User[] = this.toppings;
    this.chatService.addUsersToRoom(
      this.current_company,
      this.current_room,
      users
    );
  }

  findroomsByUser() {
    this.chatService
      .getRoomsByUser(this.current_company, this.current_user)
      .subscribe((data) => console.log('data: ' + data.length));
  }
}
