import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/interfaces/company';
import { AuthService, req_inviteUser } from 'src/app/services/auth.service';
import { User } from '../users/users.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  formUser!: FormGroup;
  role!: string;
  request!: req_inviteUser;
  currentCompany!: Company;
  message!: any;
  per: string = "EMPLOYÉ";

  constructor(
    public dialogRef: MatDialogRef<User>,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    let cc = localStorage.getItem('CurrentCompany');
    if (cc) {
      this.currentCompany = JSON.parse(cc);
    }

    this.formUser = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

   inviteUser() {
    this.request = {
      user: {
        username: this.formUser.value.username,
        email: this.formUser.value.email,
      },
      permission: this.per,
    };
    console.log(this.request);

    //  this.message=await
     this.authService.inviteUser(
      this.currentCompany.companyId,
      this.request
    ).subscribe({
      next: (data) => {
        console.log("invited user "+  data);

        this.dialogRef.close();
      },
      error: (err) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'error',
        //   detail: `${err.error.message}`,
        // });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The invitation was sent successfully.',
        });
        this.dialogRef.close();
      },
    });

    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Success',
    //   detail: 'The invitation was sent successfully.',
    // });
    // this.dialogRef.close();

    // .subscribe({
    //   next: (data) => {
    //     console.log("invited user "+data);

    //     this.dialogRef.close();
    //   },
    //   error: (err) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'error',
    //       detail: `${err.error.message}`,
    //     });
    //   },
    // });
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  selectRole($event: any) {
    this.role = $event.target.value;
  }
}
