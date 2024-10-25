import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/interfaces/company';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  companies!: any;
  selectedCompany!: Company;
  current_company!:Company;

  constructor(public auth: AuthService, private router: Router) {
    const cc = window.localStorage.getItem('CurrentCompany');
    const companiesString = window.localStorage.getItem('currentCompanies');
    if (companiesString) {
      this.companies = JSON.parse(companiesString);
    }
    if (cc) {
      this.current_company = JSON.parse(cc);
    }
  }
  ngOnInit(): void {}

  setCurrentCompany() {
    if(this.selectedCompany!=null){
      window.localStorage.setItem(
        'CurrentCompany',
        JSON.stringify(this.selectedCompany)
      );
      //  this.router.navigateByUrl("/home");
      window.location.reload();
    }
  }
}
