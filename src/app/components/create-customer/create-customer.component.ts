import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from '../customer/customer.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  formCustomer!: FormGroup;
  request!: Customer;
  companyname!:string;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formCustomer = this.fb.group({
      customerName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      primaryContactname: ['', Validators.required],
      billingAddress: ['', Validators.required],
      shippingAddress: ['', Validators.required],
    });
  }
  createCustmer(){
    if(this.formCustomer.invalid){
      return;
    }
     let customerName = this.formCustomer.value.customerName;
     let email = this.formCustomer.value.email;
     let phone = this.formCustomer.value.phone;
     let primaryContactname = this.formCustomer.value.primaryContactname;
     let billingAddress = this.formCustomer.value.billingAddress;
     let shippingAddress = this.formCustomer.value.shippingAddress;
     
     
       this.request = {
        customerName:customerName,
        primaryContactname:primaryContactname,
        email:email,
        phone:phone,
        billingAddress:billingAddress,
        shippingAddress:shippingAddress
    
     };

     this.customerService.createCustomer(this.request).subscribe({
       next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'client créé avec succès',
          });
          this.formCustomer.reset();
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

export interface CreateCustomer {
  customer: {
    customerName: string;
    primaryContactname: string;
    email: string;
    phone: string;
    billingAddress: string;
    shippingAddress: string;
  };
  companyName: string;
}
