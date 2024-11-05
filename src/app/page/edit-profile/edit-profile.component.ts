import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  pname: string = 'นาย';
  fname: string = '';
  lname: string = '';
  email: string = '';
  phone: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  userId: string | null = null;
  userInfo: any = null; // Store fetched profile data

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.id; // Assumes user_id is stored in decoded token
      } else {
        Swal.fire('Error', 'Token not found. Please log in again.', 'error');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      Swal.fire('Error', 'Invalid token. Please log in again.', 'error');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUserProfile();
    }
  }

  getUserProfile() {
    this.http.get(`https://wag5.bowlab.net/users/profile/${this.userId}`).subscribe({
      next: (data: any) => {
        this.userInfo = data;
        // Optionally populate form fields if needed
        this.fname = data.fname;
        this.lname = data.lname;
        this.email = data.email;
        this.phone = data.phone;
      },
      error: (error) => {
        Swal.fire('Error', 'Unable to fetch profile data', 'error');
      }
    });
  }

  updateProfile() {
    // Check for password mismatch
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'อุ๊ปป...!!',
            text: 'รหัสผ่านไม่ตรงกัน! ❌',
        });
        return;
    }

    // Show confirmation dialog
    Swal.fire({
        title: 'ยืนยันการเปลี่ยนข้อมูล?',
        text: "คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูลของคุณ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, แก้ไข!',
        cancelButtonText: 'ไม่, ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            // Prepare updated data for the API call
            const updatedData = {
                pname: this.pname,
                fname: this.fname,
                lname: this.lname,
                email: this.email,
                phone: this.phone,
                password: this.newPassword || undefined // Only send password if provided
            };

            // Make the PUT request to update the user's profile
            this.http.put(`https://wag5.bowlab.net/users/name/${this.userId}`, updatedData).subscribe({
                next: (response: any) => {
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขข้อมูลสำเร็จ',
                        text: response?.message || 'Profile updated successfully.', // Fallback message
                    }).then(() => {
                        // Navigate back to the profile page
                        this.router.navigate(['/profile']);
                    });
                },
                error: (error) => {
                    // Show error message
                    Swal.fire({
                        icon: 'error',
                        title: 'อุ๊ปป...!!',
                        text: error.error?.message || 'Failed to update profile.',
                    });
                }
            });
        }
    });
}


}
