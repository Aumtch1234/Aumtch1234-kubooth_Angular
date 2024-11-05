import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  passwordVisible: boolean = false;
  passwordMismatch: boolean = false; // ตัวแปรสำหรับเช็คการไม่ตรงกันของรหัสผ่าน
  registerObj: any = {
    pname: '',
    fname: '',
    lname: '',
    email: '',
    password: '',
    phone: ''
  };

  http = inject(HttpClient);
  router = inject(Router);

  showPass() {
    this.passwordVisible = !this.passwordVisible; // สลับสถานะการแสดงรหัสผ่าน
  }

  onRegister(event: Event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อฟอร์มถูก submit

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (this.registerObj.password !== this.registerObj.c_password) {
      this.passwordMismatch = true; // ตั้งค่าสถานะการไม่ตรงกัน
      Swal.fire({
        icon: 'warning',
        title: 'รหัสผ่านไม่ตรงกัน!',
        text: 'กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านของคุณ.',
        confirmButtonText: 'OK'
      });
      return; // หยุดการทำงานของฟังก์ชันถ้ารหัสผ่านไม่ตรงกัน
    } else {
      this.passwordMismatch = false; // ตั้งค่าสถานะการตรงกัน
    }

    // ส่งข้อมูลไปยัง API
    this.http.post('https://wag5.bowlab.net/users/register', this.registerObj)
      .subscribe((res: any) => {
        console.log("Response from API:", res); // แสดงข้อมูลที่ส่งกลับจาก API ใน console

        if (res.result) {
          // การลงทะเบียนสำเร็จ
          Swal.fire({
            icon: 'success',
            title: 'ลงทะเบียนสำเร็จ!',
            text: res.message,
            confirmButtonText: 'เข้าสู่ระบบ'
          }).then(() => {
            this.router.navigateByUrl('login'); // นำทางไปหน้าเข้าสู่ระบบ
          });
        } else {
          // แสดง SweetAlert สำหรับข้อความผิดพลาด
          Swal.fire({
            icon: 'error',
            title: 'การลงทะเบียนล้มเหลว!',
            text: res.message,
            confirmButtonText: 'ลองอีกครั้ง'
          });
        }
      }, (error: any) => {
        // แสดง SweetAlert สำหรับข้อความผิดพลาดจาก error response
        console.error("Error response from API:", error);
        Swal.fire({
          icon: 'error',
          title: 'การลงทะเบียนล้มเหลว!',
          text: error.error.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด.',
          confirmButtonText: 'ลองอีกครั้ง'
        });
      });
  }
}
