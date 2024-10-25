import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, Expense } from 'src/app/services/company.service';

@Component({
  selector: 'app-create-expence',
  templateUrl: './create-expence.component.html',
  styleUrls: ['./create-expence.component.css'],
})
export class CreateExpenceComponent implements OnInit {
  formExpense!: FormGroup;

  constructor(private fb: FormBuilder, public companyService: CompanyService) {}
  ngOnInit(): void {
    this.formExpense = this.fb.group({
      expenseCategory: ['Office_Equipment'],
      date: ['', Validators.required],
      amount: ['', Validators.required],
      notes: this.fb.control(''),
    });
  }
  public createExpense() {
    let expense: Expense;
    expense = {
      date: this.formExpense.value.date,
      category: this.formExpense.value.expenseCategory,
      amount: this.formExpense.value.amount,
      note:this.formExpense.value.notes
    };
    this.companyService.createExpense(expense).subscribe({
      next:(data)=>{
        console.log(data);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
