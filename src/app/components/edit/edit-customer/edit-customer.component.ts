import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateCustomer } from '../../create-customer/create-customer.component';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { Customer } from '../../customer/customer.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css'],
}) 
export class EditCustomerComponent {
  formCustomer!: FormGroup;
  newCustomer!: Customer;
  // customerId!: any;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<EditCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.formCustomer = this.fb.group({
      customerName: [this.data.customerName, Validators.required],
      email: [this.data.email, Validators.required],
      phone: [this.data.phone],
      primaryContactname: [this.data.primaryContactname],
      billingAddress: [this.data.billingAddress],
      shippingAddress: [this.data.shippingAddress],
    });
  }
  updateCustmer() {
    let customerName = this.formCustomer.value.customerName;
    let email = this.formCustomer.value.email;
    let phone = this.formCustomer.value.phone;
    let primaryContactname = this.formCustomer.value.primaryContactname;
    let billingAddress = this.formCustomer.value.billingAddress;
    let shippingAddress = this.formCustomer.value.shippingAddress;

    this.newCustomer = {
      customerName: customerName,
      primaryContactname: primaryContactname,
      email: email,
      phone: phone,
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
    };

    this.customerService
      .updateCustomer(this.data.customerId, this.newCustomer)
      .subscribe({
        next: (data) => {
          // console.log('Successfully updated ' + data);
           this.messageService.add({
             severity: 'info',
             summary: 'Confirmed',
             detail: 'Successfully updated',
             life: 3000,
           });
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
