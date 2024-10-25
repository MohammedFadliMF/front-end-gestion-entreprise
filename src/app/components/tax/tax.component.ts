import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateTaxComponent } from '../create-tax/create-tax.component';
import { CompanyService, Tax } from 'src/app/services/company.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditTaxComponent } from '../edit/edit-tax/edit-tax.component';
import { Company } from 'src/app/interfaces/company';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css'],
})
export class TaxComponent implements AfterViewInit, OnInit {
  taxes!: any;
  dataSource!: any;
  current_company!: Company;

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
  ngOnInit(): void {
    this.companyService.getAllTaxesInCompany().subscribe({
      next: (data) => {
        this.taxes = data;
        this.dataSource = new MatTableDataSource<Tax>(this.taxes);
      },
    });
  }
  confirmDelete(event: Event, taxId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Tax?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.remove(taxId); // Call the remove method with the invoiceId
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tax deleted',
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
  remove(taxId: number): void {
    this.companyService.deleteTax(taxId).subscribe({
      next: (data) => {
        // console.log(data);
      },
    });
  }
  edit(element: Tax): void {
    this.dialog.open(EditTaxComponent, {
      data: { ...element },
    });
  }
  displayedColumns: string[] = ['id', 'name', 'percent', 'description', 'more'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    this.dialog.open(CreateTaxComponent);
  }
}
