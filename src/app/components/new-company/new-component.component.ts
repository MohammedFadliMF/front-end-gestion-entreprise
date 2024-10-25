import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-new-component',
  templateUrl: './new-component.component.html',
  styleUrls: ['./new-component.component.css'],
})
export class NewComponentComponent {
  formcompany!: FormGroup;
  request!: CreateCompany;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private companyService: CompanyService,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.formcompany = this.fb.group({
      companyName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
    });
  }
  createCompany() {
    if (this.formcompany.invalid) {
      return;
    }

    this.request = {
      company: {
        companyName: this.formcompany.value.companyName,
        companyEmail: this.formcompany.value.email,
        companyAdress: this.formcompany.value.address,
      },
      permission: 'ADMIN',
    };
    this.companyService.createCompany(this.request).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'L entreprise a été créée avec succès',
        });
         this.authService.loadProfile(data);
          window.location.href = '/home';
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
export interface CreateCompany {
  company: {
    companyName: string;
    companyEmail: string;
    companyAdress: string;
  };
  permission: string;
}
