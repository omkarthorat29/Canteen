import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL = 'http://localhost:5000/api/users'; 
  userChange  = new BehaviorSubject({})
  userActive: boolean | undefined;
  userType: any;

  constructor(private http: HttpClient) {}

  login(itkey: string) {
    const payload = {
      itkey
    };

    return this.http.post(this.URL, payload)
  }

  getCountByUserId(userId: any) {
    let url = `http://localhost:5000/api/canteen/by-date?userId=${userId}&date=${new Date().toLocaleDateString()}`
    return this.http.get(url)

  }

  getAdminEntries() {
    let url = `http://localhost:5000/api/canteen/admin-entry`
    return this.http.get(url)
  }

  updateCount(payload: any) {
    return this.http.post('http://localhost:5000/api/canteen', payload)
  }
  getReport(date: any) {
    return this.http.get(`http://localhost:5000/api/canteen/by-date?date=${date}`)
  }

  SetEntry(payload: any) {
    return this.http.post('http://localhost:5000/api/canteen/admin-entry', payload)
  }
}
