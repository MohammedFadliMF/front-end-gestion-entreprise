import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditInvoiceComponent } from '../edit/edit-invoice/edit-invoice.component';
import { CompanyService, Invoice } from 'src/app/services/company.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerService } from 'src/app/services/customer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  selectedCustomerId: number | null = null;
  selectedStatus: string | null = null;
  invoiceNumber: number | null = null;

  invoices!: any;
  dataSource!: any;
  customers!: any;
  constructor(
    public dialog: MatDialog,
    private companyService: CompanyService,
    private customerService: CustomerService,

    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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
  
  confirmdownload(event: Event, invoiceId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'La facture sera téléchargée',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.generateInvoice(invoiceId);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'La facture a été téléchargée avec succès',
          life: 3000,
        });
      },
    });
  }
  ngOnInit(): void {
    this.companyService.getAllInvoicesInCompany().subscribe({
      next: (data) => {
        this.invoices = data;
        this.dataSource = new MatTableDataSource<Invoice>(this.invoices);
      },
    });
    this.customerService.getAllCustomersInCompany().subscribe({
      next: (data) => {
        this.customers = data;
      },
    });
  }
  filterData(): void {
    // Implement your filtering logic here based on the filter criteria
    const filteredData = this.invoices.filter((invoice: any) => {
      // Example filtering logic based on customer, status, and invoice number
      return (
        (!this.selectedCustomerId ||
          invoice.customer.customerId == this.selectedCustomerId) &&
        (!this.selectedStatus || invoice.lifecycle === this.selectedStatus) &&
        (!this.invoiceNumber || invoice.invoiceId === this.invoiceNumber)
      );
    });

    // Update the dataSource with the filtered data
    this.dataSource = new MatTableDataSource<Invoice>(filteredData);
  }

  displayedColumns: string[] = [
    'id',
    'customer',
    'items',
    'status',
    'date_f',
    'tax',
    'amount',
    'more',
  ];

  edit(element: Invoice): void {
    this.dialog.open(EditInvoiceComponent, {
      data: { ...element },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.companyService.updateInvoice(result.invoiceId, result).subscribe({
    //       next: (data) => {
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Success',
    //           detail: 'The invoice has been updated',
    //         });
    //       },
    //       error: (err) => {
    //         this.messageService.add({
    //           severity: 'error',
    //           summary: 'error',
    //           detail: `${err.error.message}`,
    //         });
    //       },
    //     });
    //     // const index = this.dataSource.findIndex(
    //     //   (e:Invoice) => e.invoiceId === result.invoiceId
    //     // );
    //     // if (index !== -1) {
    //     //   this.dataSource[index] = result;
    //     // }
    //   }
    // });
  }

  remove(invoiceId: number): void {
    // this.dataSource = this.dataSource.filter(
    //   (e:Invoice) => e.invoiceId !== element.invoiceId
    // );
    this.companyService.deleteInvoice(invoiceId).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

  sendInvoiceToCustomer(invoiceId: number) {
    this.companyService.sendInvoiceToCustomer(invoiceId).subscribe({
      next: (data) => {
        console.log(data);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'message sent successfully ',
        });
      },
      error: (err) => {
        console.log(err);

        //  this.messageService.add({
        //    severity: 'error',
        //    summary: 'Error',
        //    detail: err.error.message,
        //  });
      },
    });
  }
  generateInvoice(invoiceId: number) {
    this.companyService.generateInvoice(invoiceId).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error generating invoice', error);
      }
    );
  }
}
