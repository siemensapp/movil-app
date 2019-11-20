import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthServiceService } from './auth-service.service'; 


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor( public auth: AuthServiceService, public router: Router ) { }

  canActivate() {
    if( !this.auth.isAuthenticated() ) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
