import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CompanyService, Item } from 'src/app/services/company.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent {
  formItem!: FormGroup;
  newItem!: Item;
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    public dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.formItem = this.fb.group({
      name: [this.data.itemName, Validators.required],
      price: [this.data.price, Validators.required],
      dsc: [this.data.description],
    });
  }
  updateItem() {
    if(this.formItem.invalid){
      return;
    }
    let itemName = this.formItem.value.name;
    let price = this.formItem.value.price;
    let description = this.formItem.value.dsc;

    this.newItem = {
      itemName: itemName,
      price: price,
      description: description,
    };

    this.companyService.updateItem(this.data.itemId, this.newItem).subscribe({
      next: (data) => {
        // console.log('Successfully updated ' + data);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Successfully updated',
          life: 2000,
        });
        this.dialogRef.close();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'error',
          detail: err.error.message,
          life: 2000,
        });
      },
    });
  }
}
