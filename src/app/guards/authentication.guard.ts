import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
 const authService: AuthService = inject(AuthService);
 const router: Router = inject(Router);

 const selected = window.localStorage.getItem('isAuthenticated');
 let isAuthenticated!: any;
 if (selected) {
   isAuthenticated = JSON.parse(selected);
 }
 if (isAuthenticated === true) {
   return true;
 } else {
   router.navigateByUrl('/login');
   return false;
 }
    
};
