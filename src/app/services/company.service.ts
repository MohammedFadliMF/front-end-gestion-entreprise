import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Company } from '../interfaces/company';
import { CreateCompany } from '../page/create-company/create-company.component';
import { Observable, map } from 'rxjs';
import { UpdateCompany } from '../components/settings/setting-company/setting-company.component';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  companyId: any;

  options: any;
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
  public createCompany(request: CreateCompany) {
    return this.http.post(
      'http://localhost:8585/create-company',
      request,
      this.options
    );
  }
  public updateCompany(request: UpdateCompany) {
    return this.http.put(
      `http://localhost:8585/update-company/${this.companyId}`,
      request,
      this.options
    );
  }
  public getTotalCompany() {
    return this.http.get(
      `http://localhost:8585/total/${this.companyId}`,
      this.options
    );
  }

  //Invoice
  public createInvoice(invoice: Invoice) {
    return this.http.post(
      `http://localhost:8585/invoice/create-invoice/${this.companyId}`,
      invoice,
      this.options
    );
  }
  public updateInvoice(invoiceId: any, newInvoice: Invoice) {
    return this.http.put(
      `http://localhost:8585/invoice/update/${invoiceId}/${this.companyId}`,
      newInvoice,
      this.options
    );
  }
  public deleteInvoice(invoiceId: number) {
    return this.http.delete(
      `http://localhost:8585/invoice/delete/${invoiceId}/${this.companyId}`,
      this.options
    );
  }

  public getAllInvoicesInCompany() {
    return this.http.get(
      `http://localhost:8585/invoice/all/${this.companyId}`,
      this.options
    );
  }
  public sendInvoiceToCustomer(invoiceId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8585/mail/send-invoice/${invoiceId}/${this.companyId}`,
      { headers: this.options.headers, responseType: 'text' as 'json' }
    );
  }
  public generateInvoice(invoiceId: number): Observable<Blob> {
    const url = `http://localhost:8585/mail/generate-i/${invoiceId}/${this.companyId}`;
    const options = {
      headers: this.options.headers,
      responseType: 'blob' as 'json', // Handle binary data
    };
    return this.http.get<Blob>(url, options);
  }

  // Items
  public createItem(item: Item) {
    return this.http.post(
      `http://localhost:8585/item/create-item/${this.companyId}`,
      item,
      this.options
    );
  }
  public updateItem(itemId: any, newItem: Item) {
    return this.http.put(
      `http://localhost:8585/item/update/${itemId}/${this.companyId}`,
      newItem,
      this.options
    );
  }
  public deleteItem(itemId: number) {
    return this.http.delete(
      `http://localhost:8585/item/delete/${itemId}/${this.companyId}`,
      this.options
    );
  }
  public getAllItemsInCompany() {
    return this.http.get(
      `http://localhost:8585/item/all/${this.companyId}`,
      this.options
    );
  }

  //Expense
  public createExpense(request: Expense) {
    return this.http.post(
      `http://localhost:8585/create-expense/${this.companyId}`,
      request,
      this.options
    );
  }
  public updateExpense(newExpense: Expense, expenseId: number) {
    return this.http.put(
      `http://localhost:8585/update-expense/${this.companyId}/${expenseId}`,
      newExpense,
      this.options
    );
  }
  public deleteExpense(expenseId: number) {
    return this.http.delete(
      `http://localhost:8585/${this.companyId}/${expenseId}`,
      this.options
    );
  }
  public getAllExpensesInCompany() {
    return this.http.get(
      `http://localhost:8585/expenses/${this.companyId}`,
      this.options
    );
  }
  public getAllExpensesByDateInCompany(date: Datee) {
    return this.http.post(
      `http://localhost:8585/expenses/${this.companyId}`,
      date,
      this.options
    );
  }
  public getAllUsersInCompany() {
    return this.http.get(
      `http://localhost:8585/auth/${this.companyId}/users`,
      this.options
    );
  }

  //Taxes
  public createTax(request: Tax) {
    return this.http.post(
      ` http://localhost:8585/tax/${this.companyId}/create-tax`,
      request,
      this.options
    );
  }
  public updateTax(taxId: any, newTax: Tax) {
    return this.http.put(
      `http://localhost:8585/tax/update/${taxId}/${this.companyId}`,
      newTax,
      this.options
    );
  }
  public deleteTax(taxId: number) {
    return this.http.delete(
      `http://localhost:8585/tax/delete/${taxId}/${this.companyId}`,
      this.options
    );
  }
  public getAllTaxesInCompany() {
    return this.http.get(
      `http://localhost:8585/tax/${this.companyId}`,
      this.options
    );
  }

  //
  fetchData_invoice(filter: string): Observable<{
    labels: string[];
    invoiceData: number[];
    // expenseData: number[];
  }> {
    return this.http
      .get<{ invoices: ResponseItem[] }>(
        `http://localhost:8585/invoice/summary-invoice/${this.companyId}`,
        {
          params: new HttpParams().set('filter', filter),
          headers: this.options.headers,
          observe: 'body',
        }
      )
      .pipe(
        map((response) => {
          const labels = response.invoices.map((item) => item.date); // Assuming invoices and expenses have the same dates
          const invoiceData = response.invoices.map((item) => item.totalAmount);
          // const expenseData = response.expenses.map((item) => item.totalAmount);
          return { labels, invoiceData };
        })
      );
  }
  fetchData_expense(filter: string): Observable<{
    labels: string[];
    // invoiceData: number[];
    expenseData: number[];
  }> {
    return this.http
      .get<{ expenses: ResponseItem[] }>(
        `http://localhost:8585/invoice/summary-expense/${this.companyId}`,
        {
          params: new HttpParams().set('filter', filter),
          headers: this.options.headers,
          observe: 'body',
        }
      )
      .pipe(
        map((response) => {
          const labels = response.expenses.map((item) => item.date); // Assuming invoices and expenses have the same dates
          // const invoiceData = response.invoices.map((item) => item.totalAmount);
          const expenseData = response.expenses.map((item) => item.totalAmount);
          return { labels, expenseData };
        })
      );
  }

  public deleteUser(userId: number) {
    return this.http.post(
      `http://localhost:8585/remove-user/${userId}/${this.companyId}`,
      {},
      this.options
    );
  }
}



//
export interface Datee {
  date1: string;
  date2: string;
}
export interface Item {
  itemId?: number;
  itemName: string;
  price: number;
  description: string;
}
export interface Item_i {
  itemId?: number;
  itemName: string;
  price: number;
  quantity: number;
}

export interface Customer {
  customerId?: number;
  customerName: string;
  primaryContactname: string;
  email: string;
  phone: string;
  billingAddress?: string;
  shippingAddress?: string;
}

export interface Invoice {
  invoiceId?: number;
  customer: Customer;
  lifecycle: string;
  datef: string;
  items: Item_i[];
  tax: Tax;
}

export interface InvoiceData {
  invoice: Invoice;
  companyName: string;
}

export interface Expense {
  expenseId?: number;
  date?: string;
  category: String;
  amount: number;
  note: string;
}

export interface Tax {
  taxId?: number;
  name: string;
  percent: String;
  description?: string;
}

export interface ResponseItem {
  date: string; // Adjust the type as per your actual data structure
  totalAmount: number;
}
