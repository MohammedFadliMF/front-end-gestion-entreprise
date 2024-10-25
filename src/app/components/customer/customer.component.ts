import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from 'src/app/services/customer.service';
import { EditCustomerComponent } from '../edit/edit-customer/edit-customer.component';
import { Company } from 'src/app/interfaces/company';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements AfterViewInit, OnInit {
  customers!: any;
  dataSource: any;
   current_company!:Company;

  constructor(
    private customerservice: CustomerService,
    public dialog: MatDialog
  ) {
    const cc = window.localStorage.getItem('CurrentCompany');
    if (cc) {
      this.current_company = JSON.parse(cc);
    }
  }
  ngOnInit(): void {
    this.customerservice.getAllCustomersInCompany().subscribe({
      next: (data) => {
        this.customers = data;
        this.dataSource = new MatTableDataSource<Customer>(this.customers);
      },
    });
  }

  displayedColumns: string[] = [
    'customerId',
    'customerName',
    'primaryContactname',
    'email',
    'phone',
    'billingAddress',
    'shippingAddress',
    'more',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  confirmDelete(event: Event, invoiceId: number) {
    console.log('delete');
  }
  edit(element: Customer) {
    console.log('edit');
     const dialogRef = this.dialog.open(EditCustomerComponent, {
       data: { ...element },
     });
  }
}
export interface Customer {
  customerId?: number;
  customerName: string;
  primaryContactname: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
}


