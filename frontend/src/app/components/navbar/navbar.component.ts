import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private loggedIn: boolean;
  constructor(
    private _auth: AuthService,
    private _authService: AuthService,
    private router: Router,
    private _tokenService: TokenService
    ) { }

  ngOnInit() {
    this._auth.authStatus.subscribe(value => {
      this.loggedIn = value
    });
    
  }

  logout(event: MouseEvent)
  {
    event.preventDefault();
    this._tokenService.remove();
    this._authService.updateAuthStatus(false);
    this.router.navigateByUrl('/login');
  }

}
