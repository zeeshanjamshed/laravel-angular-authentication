import { Component, OnInit } from '@angular/core';
import { JarwisService } from 'src/app/services/jarwis.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form = {
    email: null,
    password: null
  }
  errorMsg = null;
  constructor(
    private _jarwis: JarwisService,
    private _tokenService: TokenService,
    private router: Router,
    private _authService: AuthService
    ) { }

  ngOnInit() {
  }

  // method for submit form
  onSubmit()
  {
    // console.log(this.form);
    return this._jarwis.login(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  // assigning the error to local variable
  handleError(error)
  {
    this.errorMsg = error.error.error;
  }

  // handling successfull response
  handleResponse(data)
  {
    this._tokenService.handle(data.access_token);
    this._authService.updateAuthStatus(true);
    this.router.navigateByUrl('/profile');
  }
}
