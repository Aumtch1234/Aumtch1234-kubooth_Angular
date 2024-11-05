import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    const decoded: any = jwtDecode(token);
    if (decoded.role === 'admin') {
      return true; // Allow access
    }
  }

  // Redirect to login or unauthorized page
  router.navigate(['/login']); // Change this path as needed
  return false;
};
