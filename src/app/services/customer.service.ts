import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCustomer } from '../components/create-customer/create-customer.component';
import { AuthService } from './auth.service';
import { Customer } from '../components/customer/customer.component';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  options: any;
  companyId!: any;
  token: any;
  constructor(private http: HttpClient) {
    this.token = window.localStorage.getItem('jwt-token');
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };
     const selected = window.localStorage.getItem('CurrentCompany');
     if (selected) {
       this.companyId = JSON.parse(selected).companyId;
     }
  }

  public createCustomer(request: Customer) {
    return this.http.post(
     `http://localhost:8585/customer/create-customer/${this.companyId}`,
      request,
      this.options
    );
  }
  public updateCustomer(customerId:any,newCustomer: Customer) {
    return this.http.put(
      `http://localhost:8585/customer/update/${customerId}/${this.companyId}`,
      newCustomer,
      this.options
    );
  }
  public getAllCustomersInCompany() {
    return this.http.get(
      `http://localhost:8585/customer/customers/${this.companyId}`,
      this.options
    );
    // .pipe(catchError(this.handleError<Chat[]>('getting all chats', [])));
  }
}

