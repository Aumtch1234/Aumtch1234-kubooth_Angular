import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataBoothService {
  public apiUrl = 'https://your-api-url.com/booths'; // เปลี่ยนเป็น public

  constructor(private http: HttpClient) {}

  getBooths(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
