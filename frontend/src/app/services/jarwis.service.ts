import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JarwisService {

  private baseUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  // login request
  login(data)
  {
    return this.http.post(`${this.baseUrl}/auth/login`,data);
  }
  // register request
  register(data)
  {
    return this.http.post(`${this.baseUrl}/auth/register`,data);
  }
}
