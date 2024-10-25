import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Added Validators.required and Validators.email
      password: ['', Validators.required], // Added Validators.required
    });
  }

  login() {
    if (this.formLogin.invalid) {
      return; 
    }

    let email = this.formLogin.value.email;
    let password = this.formLogin.value.password;

    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.authService.loadProfile(data);
        if (this.authService.currentCompanies !== null) {
          // console.log('login ' + this.authService.currentCompanies);
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/create-company');
        }
      },
      error: (err) => {
          this.errorMessage=err.error.message;
      },
    });
  }
}
