import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompanyService, Item } from 'src/app/services/company.service';
import { EditItemComponent } from '../edit/edit-item/edit-item.component';
import { Company } from 'src/app/interfaces/company';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements AfterViewInit, OnInit {
  items!: any;
  dataSource!: any;
  current_company!: Company;

  constructor(
    private companyService: CompanyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
     const cc = window.localStorage.getItem('CurrentCompany');
     if (cc) {
       this.current_company = JSON.parse(cc);
     }
  }
  ngOnInit(): void {
    this.companyService.getAllItemsInCompany().subscribe({
      next: (data) => {
        this.items = data;
        this.dataSource = new MatTableDataSource<Item>(this.items);
      },
    });
  }
  confirmDelete(event: Event, itemId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this item?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.remove(itemId); // Call the remove method with the invoiceId
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
          life: 2000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 2000,
        });
      },
    });
  }

  displayedColumns: string[] = [
    'id',
    'itemName',
    'price',
    'description',
    'more',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  edit(element: Item): void {
    const dialogRef = this.dialog.open(EditItemComponent, {
      data: { ...element },
    });
  }
  remove(itemId: number): void {
    // this.dataSource = this.dataSource.filter(
    //   (e:Invoice) => e.invoiceId !== element.invoiceId
    // );
    this.companyService.deleteItem(itemId).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'item deleted',
          life: 3000,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: `$err.error.message`,
          life: 3000,
        });
      },
    });
  }
}


