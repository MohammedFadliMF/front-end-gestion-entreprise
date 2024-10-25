import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserComponent } from '../user/user.component';
import { CompanyService } from 'src/app/services/company.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements AfterViewInit, OnInit {
  users!: any;
  dataSource: any;
  constructor(
    private companyService: CompanyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {}
  confirmDelete(event: Event, userId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.remove(userId); // Call the remove method with the invoiceId
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
  remove(invoiceId: number): void {
    this.companyService.deleteUser(invoiceId).subscribe({
      next: (data) => {
        console.log("data");
        console.log(data);
      },
    });
  }
  ngOnInit(): void {
    this.companyService.getAllUsersInCompany().subscribe({
      next: (data) => {
        this.users = data;
        this.dataSource = new MatTableDataSource<User>(this.users);
      },
    });
  }

  openDialog() {
    this.dialog.open(UserComponent);
  }

  displayedColumns: string[] = ['userId', 'username', 'email', 'more'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
export interface User {
  userId: number;
  username: string;
  email: string;
}
