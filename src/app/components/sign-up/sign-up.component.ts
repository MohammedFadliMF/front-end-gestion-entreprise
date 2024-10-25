import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  formsignup!: FormGroup;
  user!: User_req;
  errorMessage!:string;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    
  ) {}

  ngOnInit(): void {
    this.formsignup = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  register() {
    let username = this.formsignup.value.username;
    let pwd = this.formsignup.value.password;
    let email = this.formsignup.value.email;

    this.user = {
      username: username,
      email: email,
      password: pwd,
    };

    this.authService.register(this.user).subscribe({
      next: (data) => {
        this.authService.loadProfile(data);
        // console.log('register ' + data);
        this.router.navigateByUrl('/create-company');
      },
      error: (err) => {
        this.errorMessage=err.error.message;
      },
    });
  }
}

export interface User_req {
  username: string;
  email: string;
  password?: string;
}


 

