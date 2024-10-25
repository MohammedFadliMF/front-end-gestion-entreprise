import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  CompanyService,
  Item,
  InvoiceData,
  Item_i,
  Invoice,
} from 'src/app/services/company.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CreateTaxComponent } from '../create-tax/create-tax.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css'],
})
export class CreateInvoiceComponent implements OnInit {
  formInvoice!: FormGroup;

  items: any;
  selectedItem!: Item;

  items_invoice: Item_i[] = [];

  taxes: any;
  selectedTax: any;
  customers: any;

  selectedCustomer: any;

  request!: Invoice;
  companyname!: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public companyService: CompanyService,
    public customerService: CustomerService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.companyService.getAllItemsInCompany().subscribe({
      next: (data) => {
        this.items = data;
      },
    });

    this.customerService.getAllCustomersInCompany().subscribe({
      next: (data) => {
        this.customers = data;
      },
    });
    this.companyService.getAllTaxesInCompany().subscribe({
      next: (data) => {
        this.taxes = data;
      },
    });
 

    this.formInvoice = this.fb.group({
      customer: ['', Validators.required],
      tax: ['', Validators.required],
      date_f: ['', Validators.required],
      notes: this.fb.control(''),
      quantity: this.fb.control(1, Validators.min(1)),
    });
  }
 openDialog() {
    this.dialog.open(CreateTaxComponent);
  }
  addItem() {
    if (this.selectedItem && this.formInvoice.value.quantity > 0) {
      let item: Item_i;
      item = {
        itemId: this.selectedItem.itemId,
        itemName: this.selectedItem.itemName,
        price: this.selectedItem.price,
        quantity: this.formInvoice.value.quantity,
      };

      this.items_invoice.push(item);
      this.calculateSubtotal();
      // console.log('*************items_Invoice************');
      // this._snackBar.open('item has been added successfully ', '', {
      //   horizontalPosition: this.horizontalPosition,
      //   verticalPosition: this.verticalPosition,
      //   duration: 4000,
      // });
      // this.items_invoice.forEach((item: Item_i) => {
      //   console.log(
      //     'item: ' + item.itemName + '    quantity: ' + item.quantity
      //   );
      // });
      this.formInvoice.get('quantity')?.setValue(1);
    }
  }

  removeItem(index: number) {
    if (index > -1 && index < this.items_invoice.length) {
      this.items_invoice.splice(index, 1);
      // this._snackBar.open('Item has been removed successfully', '', {
      //   horizontalPosition: this.horizontalPosition,
      //   verticalPosition: this.verticalPosition,
      //   duration: 4000,
      // });
    }
  }

  createInvoice() {
    if (this.formInvoice.invalid && this.items_invoice.length == 0) {
      return; // Don't proceed if form is invalid
    }
    let cc = localStorage.getItem('CurrentCompany');
    if (cc) {
      this.companyname = JSON.parse(cc).companyName;
    }

    this.request = {
      customer: this.customers.find(
        (customer: any) =>
          customer.customerId == this.formInvoice.value.customer
      ),
      lifecycle: 'DRAFT',
      datef: this.formInvoice.value.date_f,
      items: this.items_invoice,
      tax: this.taxes.find(
        (tax: any) => tax.taxId == this.formInvoice.value.tax
      ),
    };
    // console.log('customer : ' + this.request.customer.customerId);

    this.companyService.createInvoice(this.request).subscribe({
      next: (data) => {
        this._snackBar.open('invoice has been created successfully ', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });

        this.formInvoice.reset();
      },
      error: (err) => {
        this._snackBar.open(err.error.message, '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
        console.log(err);
      },
    });
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    this.items_invoice?.forEach((item: Item_i, quantity: number) => {
      subtotal += item.price * quantity;
    });
    return subtotal;
  }
  calculateTotalAmount(): number {
    return this.calculateSubtotal()+(this.selectedTax * this.calculateSubtotal())/100;
  }

  // onCustomerSelected($event: any) {
  //   let id = $event.target.value;
  //   console.log('id: ' + id);
  //   if (id === 'create_c') {
  //     this.router.navigateByUrl('/home/create-customer');
  //   } else {
  //     this.selectedCustomer = this.customers.find(
  //       (customer: any) => customer.customerId == id
  //     );
  //     console.log(this.selectedCustomer);
  //   }
  // }
  onTaxSelected($event: any) {
    let id = $event.target.value;
    console.log('id: ' + id);
    if (id === 'create_t') {
      this.router.navigateByUrl('/home/create-tax');
    } else {
      this.selectedTax = this.taxes.find((tax: any) => tax.taxId == id).amount;
      console.log(this.selectedTax);
    }
  }
  onItemSelect($event: any) {
    let id = $event.target.value;
    console.log('id: ' + id);
    this.selectedItem = this.items.find((item: any) => item.itemId == id);
    console.log(this.selectedItem);
  }
}
