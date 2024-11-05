import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

export const customerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    const decoded: any = jwtDecode(token);
    if (decoded.role === 'customer') {
      return true; // Allow access
    }
  }

  // ใช้ SweetAlert2 เพื่อแสดงการแจ้งเตือน
  Swal.fire({
    icon: 'error',
    title: 'การเข้าถึงถูกปฏิเสธ',
    text: 'คุณไม่มีสิทธิ์จอง กรุณาเข้าสู่ระบบ!!',
    confirmButtonText: 'ตกลง'
  }).then(() => {
    // หลังจากปิดการแจ้งเตือน ให้เปลี่ยนเส้นทางไปยังหน้า login
    router.navigate(['/login']);
  });

  return false;
};
