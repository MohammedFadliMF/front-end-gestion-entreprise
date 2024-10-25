import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { User_req } from '../components/sign-up/sign-up.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: boolean = false;
  roles: any;
  current_user: any;
  accessToken!: any;
  id: Number = 1;
  currentCompanies: any;
  selectedCompany: any;
  options: any;

  constructor(private http: HttpClient, private router: Router) {
    let token = window.localStorage.getItem('jwt-token');
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  public register(user: User_req): Observable<any> {
    console.log('auth ' + user);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post('http://localhost:8585/auth/signup', user, {
      headers: headers,
    });
  }

  public login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };
    let params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post('http://localhost:8585/auth/login', params, options);
  }
  loadProfile(data: any) {
    window.localStorage.setItem('isAuthenticated', JSON.stringify(true));
    this.isAuthenticated = true;
    this.accessToken = data['access-token'];
    let decodedJwt: any = jwtDecode(this.accessToken);
    this.current_user = decodedJwt.user;
    this.roles = decodedJwt.roles;
    // console.log(this.roles[0]?.companyDTO);
    this.currentCompanies =
      this.roles.length === 0
        ? null
        : this.roles.map((role: { companyDTO: any; permition: string }) => {
            return {
              companyId: role.companyDTO.companyId,
              companyName: role.companyDTO.companyName,
              permission: role.permition,
            };
          });
    if (this.currentCompanies?.length > 0) {
      window.localStorage.setItem(
        'CurrentCompany',
        JSON.stringify(this.currentCompanies[0])
      );
    }
    window.localStorage.setItem('jwt-token', this.accessToken);
    window.localStorage.setItem(
      'currentCompanies',
      JSON.stringify(this.currentCompanies)
    );
    window.localStorage.setItem(
      'current_user',
      JSON.stringify(this.current_user)
    );

    //  console.log('current companies => ');
    // this.currentCompanies.forEach((company:any) => {
    //   console.log("company :"+company.companyName);
    // });
  }
  logout() {
    window.localStorage.setItem('isAuthenticated', JSON.stringify(false));
    // this.isAuthenticated = false;
    this.accessToken = undefined;
    this.current_user = undefined;
    this.roles = undefined;
    this.currentCompanies = undefined;
    window.localStorage.removeItem('jwt-token');
    window.localStorage.removeItem('currentCompanies');
    window.localStorage.removeItem('jwt-token');

    this.router.navigateByUrl('/login');
  }

  // loadjwtTokenFromLocalStotrage() {
  //   let token = window.localStorage.getItem('jwt-token');
  //   if (token) {
  //     this.loadProfile({ 'access-token': token });
  //     this.router.navigateByUrl('/admin/customers');
  //   }
  // }

    inviteUser(companyId: number, request: req_inviteUser): Observable<any> {
    // console.log('auth ' + request);

    return this.http.post(
      `http://localhost:8585/auth/invite-user/${companyId}`,
      request,
      this.options
    );
    }
  updateUser(newUser: User_Updated){
    return this.http.put('http://localhost:8585/auth/update',
      newUser,
      this.options
    );
  }
}
export interface req_inviteUser {
  user: User_req;
  permission:string;
}

export interface User_Updated {
  userId: number;
  username: string;
  email: string;
  password:string;
}
