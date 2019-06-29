import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private iss = {
    login: 'http://localhost:8000/api/auth/login',
    signup: 'http://localhost:8000/api/auth/register',
  }
  constructor() { }

  // handle the response token
  handle(token){
    this.setToken(token);
    // console.log(this.loggedIn());
  }

  // save token to local storage
  setToken(token)
  {
    localStorage.setItem('token', token);
  }

  // get token from local storage
  getToken()
  {
    return localStorage.getItem('token');
  }

  // remove token from local storage
  remove()
  {
    localStorage.removeItem('token');
  }

  // check token validation
  isValidToken()
  {
    const token = this.getToken();
    if(token)
    {
      const payload = this.payload(token);
      if(payload)
      {
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }
    return false;
  }

  // get payload from token
  payload(token)
  {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  // decode the payload
  decode(payload)
  {
    return JSON.parse(atob(payload));
  }

  // check user logged in or not
  loggedIn()
  {
    return this.isValidToken();
  }

}
