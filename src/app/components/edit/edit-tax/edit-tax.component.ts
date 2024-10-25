import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CompanyService, Tax } from 'src/app/services/company.service';

@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrls: ['./edit-tax.component.css'],
})
export class EditTaxComponent {
  formtax!: FormGroup;
  newTax!: Tax;
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    public dialogRef: MatDialogRef<EditTaxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tax,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.formtax = this.fb.group({
      name: [this.data.name, Validators.required],
      taux: [this.data.percent, Validators.required],
      dsc: [this.data.description],
    });
  }
  update() {
    if (this.formtax.invalid) {
      return;
    }
    let taxName = this.formtax.value.name;
    let taux = this.formtax.value.taux;
    let description = this.formtax.value.dsc;

    this.newTax = {
      name: taxName,
      percent: taux,
      description: description,
    };

    this.companyService.updateTax(this.data.taxId, this.newTax).subscribe({
      next: (data) => {
        // console.log('Successfully updated ' + data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully updated',
          life: 2000,
        });
        this.dialogRef.close();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 2000,
        });
      },
    });
  }
}
