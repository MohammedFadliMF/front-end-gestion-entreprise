import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import {
  CompanyService,
  Invoice,
  Item,
  Item_i,
} from 'src/app/services/company.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css'],
})
export class EditInvoiceComponent implements OnInit {
  taxes: any;
  selectedTax: any;
  formEdit!: FormGroup;

  quantity!: number;
  // item!: Item;
  selectedItemId: number | null = null;
  selectedItem!: Item_i;
  items_company!: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  customers!: any;

  constructor(
    public dialogRef: MatDialogRef<EditInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Invoice,
    private _snackBar: MatSnackBar,
    private companyService: CompanyService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService,
    private messageService: MessageService
  ) {
    this.formEdit = this.fb.group({
      customer: [this.data.customer.customerId, Validators.required],
      date_f: this.fb.control(''),
      lifecycle: [this.data.lifecycle, Validators.required],
      tax: [this.data.tax.taxId, Validators.required],
      items: this.fb.array([]),
      notes: this.fb.control(''),
      quantity: this.fb.control(1, Validators.min(1)),
    });
  }

  ngOnInit(): void {
    this.companyService.getAllItemsInCompany().subscribe({
      next: (data) => {
        this.items_company = data;
      },
    });

    this.companyService.getAllTaxesInCompany().subscribe({
      next: (data) => {
        this.taxes = data;
      },
    });
    this.customerService.getAllCustomersInCompany().subscribe({
      next: (data) => {
        this.customers = data;
      },
    });

    this.setItems(this.data.items);
  }
  setItems(items: Item_i[]) {
    const itemFGs = items.map((item) =>
      this.fb.group({
        itemId: [item.itemId],
        itemName: [item.itemName],
        price: [item.price],
        quantity: [item.quantity, Validators.min(1)],
      })
    );
    const itemsFormArray = this.fb.array(itemFGs);
    this.formEdit.setControl('items', itemsFormArray);
  }

  get items(): FormArray {
    return this.formEdit.get('items') as FormArray;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  editInvoice(): void {
    if (this.formEdit.invalid) {
      return; // Don't proceed if form is invalid
    }
    // Extracting customer from the form
    const customer = this.customers?.find(
      (customer: any) => customer.customerId === this.formEdit.value.customer
    );
    const tax = this.taxes?.find(
      (tax: any) => tax.taxId === this.formEdit.value.tax
    );

    // Extracting lifecycle from the form
    const lifecycle = this.formEdit.value.lifecycle;

    // Extracting items from the form and building the items array
    const items = this.formEdit.value.items.map((item: any) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      quantity: item.quantity,
    }));

    // Constructing the request object
    const request: any = {
      customer: customer,
      lifecycle: lifecycle,
      items: items,
      tax: tax,
    };

    this.companyService.updateInvoice(this.data.invoiceId, request).subscribe({
      next: (data) => {
        // console.log('tax: ' + request.tax);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The invoice has been updated',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'error',
          detail: `${err.error.message}`,
        });
        // console.log(err.error.message);
      },
    });
    this.cdr.detectChanges();

    this.dialogRef.close();
  }
  // removeItem(index: number) {
  //   if (index > -1 && index < this.data.items.length) {
  //     this.data.items.splice(index, 1);
  //     this._snackBar.open('Item has been removed successfully', '', {
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //       duration: 4000,
  //     });
  //   }
  // }
  removeItem(index: number, event: Event) {
    event.stopPropagation(); // Prevent the event from bubbling up to the form
    event.preventDefault();
    if (this.items.length > 1) {
      this.items.removeAt(index);
    } else {
      this._snackBar.open('Cannot remove the last item', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 4000,
      });
    }
  }

  // increaseQuantity(index: number) {
  //   if (index > -1 && index < this.data.items.length) {
  //     this.data.items[index].quantity += 1;
  //     this._snackBar.open('Quantity has been increased', '', {
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //       duration: 4000,
  //     });
  //   }
  // }
  increaseQuantity(index: number) {
    const control = this.items.at(index).get('quantity');
    control?.setValue(control.value + 1);
  }

  onItemSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedItemId = Number(selectElement.value);
  }

  addItem() {
    if (this.selectedItemId !== null) {
      const selectedItem = this.items_company?.find(
        (item: any) => item.itemId === this.selectedItemId
      );
      if (selectedItem && !this.itemExists(selectedItem.itemId)) {
        const itemGroup = this.fb.group({
          itemId: [selectedItem.itemId],
          itemName: [selectedItem.itemName],
          price: [selectedItem.price],
          quantity: [this.formEdit.get('quantity')?.value, Validators.min(1)],
        });
        this.items.push(itemGroup);
        this.cdr.detectChanges();
      } else {
        alert('Item already exists in the list');
      }
    }
  }

  itemExists(itemId: number): boolean {
    return this.items.controls.some(
      (control) => control.value.itemId === itemId
    );
  }

  // onItemSelect($event: any) {
  //   let id = $event.target.value;
  //   this.item = this.items_company.find((item: any) => item.itemId == id);
  // }
  // addItem() {
  //   this.selectedItem = {
  //     itemId: this.item.itemId,
  //     itemName: this.item.itemName,
  //     price: this.item.price,
  //     quantity: this.quantity,
  //   };
  //   if (this.selectedItem && this.quantity > 0) {
  //     const existingItemIndex = this.data.items.findIndex(
  //       (item) => item.itemId === this.selectedItem.itemId
  //     );
  //     if (existingItemIndex == -1) {
  //       this.data.items.push(this.selectedItem);
  //       this.quantity = 1;
  //     }
  //   }
  // }

  // onTaxSelected($event: any) {
  //   let id = $event.target.value;
  //   console.log('id: ' + id);
  //   if (id === 'create_t') {
  //     this.router.navigateByUrl('/home/create-tax');
  //   } else {
  //     this.selectedTax = this.taxes.find((tax: any) => tax.taxId == id);
  //     console.log(this.selectedTax);
  //   }
  // }
}
