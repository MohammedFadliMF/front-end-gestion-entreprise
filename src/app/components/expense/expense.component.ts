import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompanyService, Expense } from 'src/app/services/company.service';
import { EditExpenseComponent } from '../edit/edit-expense/edit-expense.component';
import { Company } from 'src/app/interfaces/company';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements AfterViewInit, OnInit {
  expenses!: any;
  dataSource!: any;
  current_company!: Company;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    public dialog: MatDialog,
    private companyService: CompanyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
     const cc = window.localStorage.getItem('CurrentCompany');
     if (cc) {
       this.current_company = JSON.parse(cc);
     }
  }
  confirmDelete(event: Event, invoiceId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.remove(invoiceId); // Call the remove method with the invoiceId
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
  ngOnInit(): void {
    this.companyService.getAllExpensesInCompany().subscribe({
      next: (data) => {
        this.expenses = data;
        this.dataSource = new MatTableDataSource<Expense>(this.expenses);
      },
    });
  }

  displayedColumns: string[] = [
    'id',
    'date',
    'category',
    'amount',
    'notes',
    'more',
  ];
  edit(element: Expense): void {
    this.dialog.open(EditExpenseComponent, {
      data: { ...element },
    });
  }
  remove(expenseId: number): void {
    this.companyService.deleteExpense(expenseId).subscribe({
      next: (data) => {
        // console.log(data);
      },
    });
  }
}


