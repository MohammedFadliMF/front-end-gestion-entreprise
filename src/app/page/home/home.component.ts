import { Component } from '@angular/core';
import { Company } from 'src/app/interfaces/company';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  companies!: any;
  selectedCompany!: Company;
  current_user!: any;
  constructor() {
    const user = window.localStorage.getItem('current_user');
    if (user) {
      this.current_user = JSON.parse(user);
    }
   
  }
  // setCurrentCompany() {
  //   window.localStorage.setItem(
  //     'CurrentUser',
  //     JSON.stringify(this.selectedCompany)
  //   );
  //   //  this.router.navigateByUrl("/home");
  //   window.location.reload();
  // }
}
