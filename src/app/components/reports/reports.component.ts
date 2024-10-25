import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyService, Datee } from 'src/app/services/company.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  formexpense!: FormGroup;
  expenses!: any;
  d!: Datee;
  message: string = '';
  minDate2: string = '';

  ngOnInit(): void {
    this.formexpense = this.fb.group({
      date_1: this.fb.control(''),
      date_2: this.fb.control(''),
    });
    this.formexpense.get('date_1')!.valueChanges.subscribe((date1) => {
      this.minDate2 = date1;
    });
  }
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private messageService: MessageService
  ) {}
  //
  public findExpensesByDate() {
    this.d = {
      date1: this.formexpense.value.date_1,
      date2: this.formexpense.value.date_2,
    };
    this.companyService.getAllExpensesByDateInCompany(this.d).subscribe({
      next: (data) => {
        // if (Array.isArray(data)) {
        this.expenses = data;
        this.message = ''; // Clear message if expenses are found
        // } else {
        //   this.message = data; // Set message if no expenses
        //   this.expenses = []; // Clear expenses if no items
        // }
      },
      error: (err) => {
        let m=err.error.message;
         this.messageService.add({
           severity: 'error',
           summary: 'Rejected',
           detail: m,
           life: 3000,
         });
        this.message = err.error.message;
        this.expenses = [];
        // console.log(this.message);
      },
    });
  }
}
