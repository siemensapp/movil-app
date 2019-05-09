import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(public jwtHelper: JwtHelperService) { }

  public isAuthenticated () {
    let token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
