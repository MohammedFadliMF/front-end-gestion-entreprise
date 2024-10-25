import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const autorizationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

   const selected = window.localStorage.getItem('CurrentCompany');
   let permission!:any;
   if (selected) {
     permission = JSON.parse(selected).permission;
   }
  if (permission === 'ADMIN') {
    return true;
  } else {
    router.navigateByUrl('/home');
    return false;
  }
};
