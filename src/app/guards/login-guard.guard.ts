import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // ถ้ามี token ใน localStorage
  if (token) {
    const decoded: any = jwtDecode(token); // decode token เพื่อดึงข้อมูล role

    if (decoded.role === 'admin') {
      // ถ้า role เป็น admin
      router.navigate(['/admin']); // เปลี่ยนเส้นทางไปหน้า admin
      return false; // ไม่อนุญาตให้เข้าถึงหน้า login
    } else if (decoded.role === 'customer') {
      // ถ้า role เป็น customer
      router.navigate(['/']); // เปลี่ยนเส้นทางไปหน้า home
      return false; // ไม่อนุญาตให้เข้าถึงหน้า login
    }
  }

  return true; // อนุญาตให้เข้าถึงหน้า login ถ้าไม่มี token
};
