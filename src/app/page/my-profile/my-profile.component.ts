import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  userInfo: any = {}; // เก็บข้อมูลที่ดึงมาจากฐานข้อมูล
  selectedStatus: string = ''; // สถานะที่เลือก
  boothtName: string = '';

  // ฟังก์ชันสำหรับการกรองบันทึก
  getFilteredBookings() {
    if (this.selectedStatus) {
      return this.userInfo.user_bookings.filter((booking: { booking_status: string; }) => booking.booking_status === this.selectedStatus);
    }
    return this.userInfo.user_bookings; // คืนค่าทั้งหมดถ้าไม่มีการเลือกสถานะ
  }

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;
  
        this.http.get(`https://wag5.bowlab.net/users/profile/${userId}`).subscribe(
          (data: any) => {
            this.userInfo = data; // เก็บข้อมูลผู้ใช้ที่ได้จาก API
            console.log("Complete User Profile:", this.userInfo);
  
          }
        );
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  
  

  


  cancelBooking(bookingId: number) {
    Swal.fire({
      title: 'ยืนยันการยกเลิก',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ยกเลิก!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`https://wag5.bowlab.net/booking/cancel/${bookingId}`, {}).subscribe(
          (response) => {
            Swal.fire(
              'ยกเลิกแล้ว!',
              'การจองของคุณถูกยกเลิกเรียบร้อยแล้ว.',
              'success'
            );
            // อัปเดตข้อมูลผู้ใช้ใหม่หลังจากยกเลิกการจอง
            this.ngOnInit();
          },
          (error) => {
            Swal.fire(
              'เกิดข้อผิดพลาด!',
              'การยกเลิกการจองล้มเหลว กรุณาลองอีกครั้ง.',
              'error'
            );
          }
        );
      }
    });
  }
  
  
  

  goToPayment(booking: any) {
    this.router.navigate(['/payment'], { state: { bookingData: booking } });
  }
}
