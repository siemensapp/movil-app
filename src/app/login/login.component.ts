import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../http-requests.service';
import { url } from '../../assets/js/variables';
import { Router } from '@angular/router';
import  Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private httpClient: HttpRequestsService, private router: Router) { }

  login() {
    var user = (<HTMLInputElement>document.getElementById("email")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var data = JSON.stringify({user: user, password: password});
    Swal.showLoading();
    this.httpClient.postData( url + '/api/login', data).then( result => {
      //Swal.close();
      if (!result.hasOwnProperty('token')) Swal.fire({type: "error", title: "Error", text: String(result)});
      else {
        // Saves user number
        localStorage.setItem('user', user);
        Swal.fire({type: "success", title: "Exito", text: JSON.stringify(result)})
          .then(() => { this.router.navigate(['home/list']) });
      }
    })
    
  }

  ngOnInit() {
  }

}