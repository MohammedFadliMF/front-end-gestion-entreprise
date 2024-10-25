import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  data_invoice: any;
  data_expense: any;

  options: any;
  filter_invoice: string = 'mois';
  filter_expense: string = 'mois';

  // default filter
  // startDate: string = '2024-05-01'; // example start date
  // endDate: string = '2024-05-31'; // example end date

  totalInvoices: any;
  totalItems: any;
  totalExpenses: any;
  constructor(
    private http: HttpClient,
    private companyService: CompanyService
  ) {}
  ngOnInit(): void {
    this.companyService.getTotalCompany().subscribe({
      next: (data: any) => {
        this.totalInvoices =parseFloat(data.totalInvoices).toFixed(2) ;
        this.totalItems = parseFloat(data.totalItems).toFixed(2);
        this.totalExpenses = parseFloat(data.totalExpenses).toFixed(2);
      },
    });

    this.fetch_invoice();
     this.fetch_expense();
  }

  fetch_invoice() {
    this.companyService.fetchData_invoice(this.filter_invoice).subscribe(
      ({ labels, invoiceData }) => {
        this.data_invoice = {
          labels: labels,
          datasets: [
            {
              label: 'Total Invoice Amount',
              data: invoiceData,
              fill: false,
              borderColor: '#4bc0c0',
            },
          ],
        };
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
  fetch_expense() {
    this.companyService.fetchData_expense(this.filter_expense).subscribe(
      ({ labels, expenseData }) => {
        this.data_expense = {
          labels: labels,
          datasets: [
            {
              label: 'Total Expense Amount',
              data: expenseData,
              fill: false,
              borderColor: '#4bc0c0',
            },
          ],
        };
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  filterInvoice(newFilter: string) {
    this.filter_invoice = newFilter;
    this.fetch_invoice();
  }

  filterExpense(newFilter: string) {
    this.filter_expense = newFilter;
    this.fetch_expense();
  }
}
export interface ResponseItem {
  date: string; // Adjust the type as per your actual data structure
  totalAmount: number;
}
