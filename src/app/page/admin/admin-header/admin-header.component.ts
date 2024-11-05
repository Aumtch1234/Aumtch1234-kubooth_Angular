import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {

  constructor(private router: Router) {}


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // ตรวจสอบว่ามี token หรือไม่
  }

  logout(): void {
    localStorage.removeItem('token'); // ลบ token
    this.router.navigate(['/login']); // เปลี่ยนเส้นทางไปที่หน้า login
  }
}
