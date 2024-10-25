import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authenticationGuard } from './guards/authentication.guard';
import { CreateCompanyComponent } from './page/create-company/create-company.component';
import { ItemComponent } from './components/item/item.component';
import { CreateItemComponent } from './components/create-item/create-item.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CreateCustomerComponent } from './components/create-customer/create-customer.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CreateExpenceComponent } from './components/create-expence/create-expence.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TaxComponent } from './components/tax/tax.component';
import { CreateTaxComponent } from './components/create-tax/create-tax.component';
import { SettingComponent } from './components/settings/setting/setting.component';
import { SettingAccountComponent } from './components/settings/setting-account/setting-account.component';
import { SettingCompanyComponent } from './components/settings/setting-company/setting-company.component';
import { SettingTaxComponent } from './components/settings/setting-tax/setting-tax.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatfrComponent } from './components/chatfr/chatfr.component';
import { UserComponent } from './components/settings/user/user.component';
import { SettingChatComponent } from './components/settings/setting-chat/setting-chat.component';
import { UsersComponent } from './components/settings/users/users.component';
import { autorizationGuard } from './guards/autorization.guard';
import { NewComponentComponent } from './components/new-company/new-component.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: SignUpComponent },
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard],
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'items',
        component: ItemComponent,
      },
      {
        path: 'create-item',
        canActivate: [autorizationGuard],
        component: CreateItemComponent,
      },
      {
        path: 'customers',
        component: CustomerComponent,
      },
      {
        path: 'create-customer',
        canActivate: [autorizationGuard],
        component: CreateCustomerComponent,
      },
      {
        path: 'invoices',
        component: InvoiceComponent,
      },
      { path: 'create-invoice', component: CreateInvoiceComponent },

      {
        path: 'expenses',
        canActivate: [autorizationGuard],
        component: ExpenseComponent,
      },
      {
        path: 'create-expense',
        canActivate: [autorizationGuard],
        component: CreateExpenceComponent,
      },
      { path: 'taxes', component: TaxComponent },
      { path: 'create-tax', component: CreateTaxComponent },

      { path: 'reports', component: ReportsComponent },

      {
        path: 'setting-users',
        component: UsersComponent,
        canActivate: [autorizationGuard],
      },
      { path: 'setting-profile', component: SettingAccountComponent },
      {
        path: 'setting-company',
        component: SettingCompanyComponent,
        canActivate: [autorizationGuard],
      },
      {
        path: 'setting-chat',
        component: SettingChatComponent,
        canActivate: [autorizationGuard],
      },

      // {
      //   path: 'setting',
      //   component: SettingComponent,
      //   children: [
      //     { path: '', component: UserComponent },
      //     { path: 'account', component: SettingAccountComponent },
      //     { path: 'company', component: SettingCompanyComponent },
      //     { path: 'tax', component: SettingTaxComponent },
      //   ],
      // },

      // { path: 'chat-room', component: ChatRoomComponent },
      // { path: 'message', component: MessageComponent },
      { path: 'chat-room', component: ChatfrComponent },
      { path: 'new-company', component: NewComponentComponent },
    ],
  },
  {
    path: 'create-company',
    component: CreateCompanyComponent,
    canActivate: [authenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
