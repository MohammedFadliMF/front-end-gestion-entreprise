import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { CompanyService, Tax } from 'src/app/services/company.service';

@Component({
  selector: 'app-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.css'],
})
export class CreateTaxComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  req_Tax!: Tax;
  formTax!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTaxComponent>,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.formTax = this.fb.group({
      name: ['', Validators.required],
      percent: ['', Validators.required],
      description: this.fb.control(''),
    });
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
    });
  }
  createTax() {
    if(this.formTax.invalid){
      return;
    }
    this.req_Tax = {
      name: this.formTax.value.name,
      percent: this.formTax.value.percent,
      description: this.formTax.value.description,
    };
    this.companyService.createTax(this.req_Tax).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tax created successfully',
          life: 2000,
        });
        // this.openSnackBar('tax created successfully ');
        this.dialogRef.close();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'error',
          detail: err.error.message,
          life: 2000,
        });
        // this.openSnackBar(err.error.message);
      },
    });
  }
}
