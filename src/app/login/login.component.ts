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
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = JSON.stringify({email: email, password: password});
    this.httpClient.postData( url + '/api/login', data).then( result => {
      console.log(result);
      if (!result.hasOwnProperty('token')) Swal.fire({type: "error", title: "Error", text: String(result)});
      else {
        Swal.fire({type: "success", title: "Exito", text: JSON.stringify(result)})
          .then(() => { this.router.navigate(['home']) });
      }
    })
    
  }

  ngOnInit() {
  }

}
