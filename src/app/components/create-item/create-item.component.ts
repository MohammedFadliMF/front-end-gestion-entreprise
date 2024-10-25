import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyService, Item } from 'src/app/services/company.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent implements OnInit {
  formItem!: FormGroup;
  request!: Item;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.formItem = this.fb.group({
      itemName: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
    });
  }
  createItem() {
    if (this.formItem.invalid) {
      return;
    }
    let itemName = this.formItem.value.itemName;
    let price = this.formItem.value.price;
    let description = this.formItem.value.description;

    this.request = {
       itemName: itemName,
      price: price,
     description: description,
    };

    this.companyService.createItem(this.request).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'article créé avec succès',
        });
        this.formItem.reset();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
        console.log(err);
      },
    });
  }
}
