import { Component, OnInit } from '@angular/core';
import { JarwisService } from 'src/app/services/jarwis.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public form = {
    name: null,
    email: null,
    password: null,
    password_confirmation: null,

  }
  errorMsgs = [];
  constructor(
    private _jarwis: JarwisService,
    private _tokenService: TokenService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  // method for submit form
  onSubmit()
  {
    // console.log(this.form);
    return this._jarwis.register(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  // assigning the error to local variable
  handleError(error)
  {
    this.errorMsgs = error.error.errors;
  }

  // handling successfull response
  handleResponse(data)
  {
    this._tokenService.handle(data.access_token);
    this.router.navigateByUrl('/profile');
  }

}
