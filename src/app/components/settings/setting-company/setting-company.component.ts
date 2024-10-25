import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/interfaces/company';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-setting-company',
  templateUrl: './setting-company.component.html',
  styleUrls: ['./setting-company.component.css'],
})
export class SettingCompanyComponent {
  formcompany!: FormGroup;
  request!: UpdateCompany;
  current_company!: Company;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private companyService: CompanyService,
    private router: Router,
    private messageService: MessageService
  ) {
     const cc = window.localStorage.getItem('CurrentCompany');
     if (cc) {
       this.current_company = JSON.parse(cc);
     }
  }
  ngOnInit(): void {
    this.formcompany = this.fb.group({
      companyName: [this.current_company.companyName, [Validators.required]],
      email: ['', [Validators.email]],
      address: [''],
    });
  }
  update() {
    if (this.formcompany.invalid) {
      return;
    }

    this.request = {
      companyName: this.formcompany.value.companyName,
      companyEmail: this.formcompany.value.companyEmail,
      companyAdress: this.formcompany.value.companyAdress,
    };
    this.companyService.updateCompany(this.request).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The company has been successfully modified',
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
export interface UpdateCompany {
    companyName: string;
    companyEmail: string;
    companyAdress: string;
  
}
