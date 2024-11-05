import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordVisible: boolean = false;
  loginObj: any = {
    "email": "",
    "password": ""
  };

  http = inject(HttpClient);
  router = inject(Router);

  showPass() {
    this.passwordVisible = !this.passwordVisible; // สลับสถานะการแสดงรหัสผ่าน
  }

  onLogin(event: Event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อฟอร์มถูก submit

    if (this.loginObj.email && this.loginObj.password) {
      this.http.post("https://wag5.bowlab.net/users/login", this.loginObj).subscribe((res: any) => {
        console.log("Response from API:", res); // แสดงข้อมูลที่ส่งกลับจาก API ใน console

        if (res.result) {
          // ล็อกอินสำเร็จ
          localStorage.setItem('token', res.data.token);
          const decodedToken: any = jwtDecode(res.data.token); // ถอดรหัส JWT
          
          console.log("Decoded Token:", decodedToken); // แสดง payload ของ token ใน console

          // เช็ค role ของผู้ใช้
          if (decodedToken.role === 'admin') {
            Swal.fire({
              icon: 'success',
              title: 'ล็อคอินเข้าสู่ระบบสำเร็จ!!',
              text: 'ยินดีค้อนรับ แอดมิน!',
              confirmButtonText: 'หวัดดีคือกัน'
            }).then(() => {
              this.router.navigateByUrl('admin'); // นำทางไปหน้า admin
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'ล็อคอินเข้าสู่ระบบสำเร็จ!!',
              text: res.message,
              confirmButtonText: 'ตกลง'
            }).then(() => {
              this.router.navigateByUrl('dashboard'); // นำทางไปหน้า dashboard ปกติ
            });
          }
        } else {
          // แสดง SweetAlert สำหรับข้อความผิดพลาด
          Swal.fire({
            icon: 'error',
            title: 'ล็อคอินเข้าสู่ระบบ ไม่สำเร็จ!!',
            text: res.message,
            confirmButtonText: 'ลองอีกครั้ง'
          });
        }
      }, (error: any) => {
        // แสดง SweetAlert สำหรับข้อความผิดพลาดจาก error response
        console.error("Error response from API:", error);
        Swal.fire({
          icon: 'error',
          title: 'ล็อคอินเข้าสู่ระบบ ไม่สำเร็จ!!',
          text: error.error.message || 'An unexpected error occurred.',
          confirmButtonText: 'ลองอีกครั้ง'
        });
      });
    } else {
      // แสดงข้อความแจ้งให้กรอกข้อมูลให้ครบ
      Swal.fire({
        icon: 'warning',
        title: 'อะแฮ่มๆ.....!!',
        text: 'กรุณาใส่ อีเมล หรือ รหัสผ่าน ด้วยนะ!',
        confirmButtonText: 'OK ค้าบบ!!'
      });
    }
  }
}
