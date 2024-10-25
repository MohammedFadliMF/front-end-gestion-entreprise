import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService, User_Updated } from 'src/app/services/auth.service';

@Component({
  selector: 'app-setting-account',
  templateUrl: './setting-account.component.html',
  styleUrls: ['./setting-account.component.css'],
})
export class SettingAccountComponent {
  formuser!: FormGroup;
  request!: User_Updated;
  current_user!: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    const cc = window.localStorage.getItem('current_user');
    if (cc) {
      this.current_user = JSON.parse(cc);
    }
  }
  ngOnInit(): void {
    this.formuser = this.fb.group({
      username: [this.current_user.username, [Validators.required]],
      email: [this.current_user.email, [Validators.email]],
      password: [''],
    });
  }
  update() {
    if (this.formuser.invalid) {
      return;
    }

    this.request = {
      userId: this.current_user.userId,
      username: this.formuser.value.username,
      email: this.formuser.value.email,
      password:this.formuser.value.password
    };
    this.authService.updateUser(this.request).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'your account has been successfully modified',
        });
      },
      error: (err) => {
        // console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
}
