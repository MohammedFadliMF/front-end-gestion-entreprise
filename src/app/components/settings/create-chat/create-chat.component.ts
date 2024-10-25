import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Company } from 'src/app/interfaces/company';
import { User } from 'src/app/interfaces/user';
import { ChatfrService } from 'src/app/services/chatfr.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.css'],
})
export class CreateChatComponent implements OnInit {
  current_company!: Company;
  req_chat!: ChatRoom;
  formChat!: any;

  users: any = [];
  users_invited: any = [];
  rooms:any=[];

  constructor(
    private fb: FormBuilder,
    private chatServie: ChatfrService,
    private companyService: CompanyService,
    public dialogRef: MatDialogRef<CreateChatComponent>
  ) {
    const cmp = window.localStorage.getItem('CurrentCompany');
    if (cmp) {
      this.current_company = JSON.parse(cmp);
    }
    this.chatServie.getRooms(this.current_company).subscribe((rooms) => {
      this.rooms = rooms;
    });
  }
  ngOnInit(): void {
    this.formChat = this.fb.group({
      name: [
        '',
        [Validators.required, this.nameNotInListValidator(this.rooms)],
      ],
    });
    this.companyService.getAllUsersInCompany().subscribe((users) => {
      this.users = users;
    });
  }

  nameNotInListValidator(existingNames: string[]): ValidatorFn {
    console.log(existingNames.length);
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value;
      if (existingNames.includes(name)) {
        return { nameExists: true };
      }
      return null;
    };
  }

  createChat() {
    if (this.formChat.invalid || this.users_invited.length == 0) {
      return;
    }
    this.req_chat = {
      name: this.formChat.value.name,
      users: this.users_invited,
    };
    // this.chatServie.addRoom(this.current_company, this.req_chat.name);
    this.chatServie
      .createRoom(this.current_company, this.req_chat.name, this.users_invited)
      .then(() => {
        this.dialogRef.close();
      });
  }
}
export interface ChatRoom{
  name:string;
  users:User[];
}
