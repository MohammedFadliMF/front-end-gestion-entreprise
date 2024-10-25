import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './page/home/home.component';
import { RightbarComponent } from './components/rightbar/rightbar.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/Material.Module';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { AppHttpInterceptor } from './interceptors/app-http.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CreateCompanyComponent } from './page/create-company/create-company.component';
import { ItemComponent } from './components/item/item.component';
import { CreateItemComponent } from './components/create-item/create-item.component';
import {  MatPaginatorModule } from '@angular/material/paginator';

import { MatTableModule } from '@angular/material/table';
import { CustomerComponent } from './components/customer/customer.component';
import { CreateCustomerComponent } from './components/create-customer/create-customer.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CreateExpenceComponent } from './components/create-expence/create-expence.component';
import { ReportsComponent } from './components/reports/reports.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TaxComponent } from './components/tax/tax.component';
import { CreateTaxComponent } from './components/create-tax/create-tax.component';
import { SettingComponent } from './components/settings/setting/setting.component';
import { SettingAccountComponent } from './components/settings/setting-account/setting-account.component';
import { SettingCompanyComponent } from './components/settings/setting-company/setting-company.component';
import { SettingTaxComponent } from './components/settings/setting-tax/setting-tax.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ChatfrComponent } from './components/chatfr/chatfr.component';
import { environment } from 'src/environments/environment';
import { UserComponent } from './components/settings/user/user.component';
import { SettingChatComponent } from './components/settings/setting-chat/setting-chat.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatDialogModule } from '@angular/material/dialog';
import { UsersComponent } from './components/settings/users/users.component';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { CreateChatComponent } from './components/settings/create-chat/create-chat.component';
import { EditInvoiceComponent } from './components/edit/edit-invoice/edit-invoice.component';


import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditCustomerComponent } from './components/edit/edit-customer/edit-customer.component';
import { EditItemComponent } from './components/edit/edit-item/edit-item.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChartModule } from 'primeng/chart';
import { EditTaxComponent } from './components/edit/edit-tax/edit-tax.component';
import { EditExpenseComponent } from './components/edit/edit-expense/edit-expense.component';
import { NewComponentComponent } from './components/new-company/new-component.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    RightbarComponent,
    HeaderComponent,
    AuthComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    CreateCompanyComponent,
    ItemComponent,
    CreateItemComponent,
    CustomerComponent,
    CreateCustomerComponent,
    InvoiceComponent,
    CreateInvoiceComponent,
    ExpenseComponent,
    CreateExpenceComponent,
    ReportsComponent,
    TaxComponent,
    CreateTaxComponent,
    SettingComponent,
    SettingAccountComponent,
    SettingCompanyComponent,
    SettingTaxComponent,
    ChatRoomComponent,
    ChatfrComponent,
    UserComponent,
    SettingChatComponent,
    UsersComponent,
    CreateChatComponent,
    EditInvoiceComponent,
    EditCustomerComponent,
    EditItemComponent,
    EditTaxComponent,
    EditExpenseComponent,
    NewComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatDialogModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyBqWG4MBQSb12oGHmjqf9HBzBhHwAFfHpE',
      authDomain: 'chat-firebase-a8f7c.firebaseapp.com',
      projectId: 'chat-firebase-a8f7c',
      storageBucket: 'chat-firebase-a8f7c.appspot.com',
      messagingSenderId: '512289021679',
      appId: '1:512289021679:web:d3a8414d0b4f8505f2851a',
      measurementId: 'G-YX5Q3G57BC',
    }),
    MultiSelectModule,
    MatSnackBarModule,
    ToastModule,
    ConfirmPopupModule,
    ScrollingModule,
    ChartModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    // {
    //   provide: RxStompService,
    //   useFactory: rxStompServiceFactory,
    // },
    //StompService,
    // { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
