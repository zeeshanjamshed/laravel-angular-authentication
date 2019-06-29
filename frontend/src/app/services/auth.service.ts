import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this._tokenService.loggedIn());
  authStatus = this.loggedIn.asObservable();

  constructor(private _tokenService: TokenService) { }

  updateAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

}
