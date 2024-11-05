import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // เพิ่มการนำเข้า
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule
    
  ], // เพิ่ม CommonModule ที่นี่
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // ตรวจสอบว่ามี token หรือไม่
  }

  logout(): void {
    localStorage.removeItem('token'); // ลบ token
    this.router.navigate(['/login']); // เปลี่ยนเส้นทางไปที่หน้า login
  }
}
