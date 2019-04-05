import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  login() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    alert(email.innerHTML);
  }

  ngOnInit() {
  }

}
