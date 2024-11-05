import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ImageDialogComponent } from '../../dialog/image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface BookingData {
  booth_id: any;
  products_data: string;
  user_id: string;
  event_id: any;
  event_name: string;
  zone_id: any;
  booth_name: any;
  size: any;
  price: any;
  status: any;
  img: any;
  booking_id?: string;
}

@Component({
  selector: 'app-book-booth',
  standalone: true,
  imports: [
    CommonModule,
     FormsModule,
    ],
  templateUrl: './book-booth.component.html',
  styleUrls: ['./book-booth.component.scss']
})
export class BookBoothComponent implements OnInit {
  selectedBooth: any;
  products_data: string = '';
  eventName: string = '';
  isLoading: boolean = false;
  eventDate: string = '';
  eventEnd: string = '';

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.selectedBooth = history.state.booth;
    console.log('Selected Booth:', this.selectedBooth);

    if (this.selectedBooth && this.selectedBooth.event_id) {
      this.http.get<any[]>('https://wag5.bowlab.net/events').subscribe(
        (eventDataArray) => {
          const matchedEvent = eventDataArray.find(event => event.event_id === this.selectedBooth.event_id);
          this.eventName = matchedEvent ? matchedEvent.event_name : 'Event not found';
          this.eventDate = matchedEvent ? matchedEvent.start_at_date : 'Event not found';
          this.eventEnd = matchedEvent ? matchedEvent.end_at_date : 'Event not found';

          console.log('Fetched Event Data:', matchedEvent);
        },
        (error) => {
          console.error('Error fetching event name:', error);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No booth selected. Redirecting to booking page.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/booking']);
      });
    }
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.id;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  }

  confirmPayment(): void {
    Swal.fire({
      title: 'ยืนยันการจองบูธ',
      html: "คุณต้องการดำเนินการยืนยันการจองบูธ โดยจะไปหน้าชำระเงินโดยอัตโนมัติ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ยืนยัน!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookBooth(); // เรียกใช้ฟังก์ชัน bookBooth() หลังจากที่ผู้ใช้ยืนยัน
      }
    });
}


  bookBooth(): void {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'แจ้งเตือน!',
        text: 'ไม่สามารถจองได้ เนื่องจากไม่พบข้อมูลผู้ใช้',
        confirmButtonText: 'ปิด'
      });
      return;
    }

    const bookingData: BookingData = {
      booth_id: this.selectedBooth.booth_id,
      products_data: this.products_data,
      user_id: userId,
      event_id: this.selectedBooth.event_id,
      event_name: this.eventName,
      zone_id: this.selectedBooth.zone_id,
      booth_name: this.selectedBooth.booth_name,
      size: this.selectedBooth.size,
      price: this.selectedBooth.price,
      status: this.selectedBooth.status,
      img: this.selectedBooth.img,
    };
    
    console.log('ส่งข้อมูลการจองไปยัง API:', bookingData);

    const apiUrl = 'https://wag5.bowlab.net/booking/booth_booking';
    this.isLoading = true;

    this.http.post(apiUrl, bookingData).subscribe(
      (response: any) => {  
        this.isLoading = false;
        console.log('การตอบกลับจาก API การจอง:', response);
        if (response.status === 'success') {
          this.verifyBooking(userId, this.selectedBooth.booth_id);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'การจองล้มเหลว!',
            text: response.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด.',
            confirmButtonText: 'ลองอีกครั้ง'
          });
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('เกิดข้อผิดพลาดระหว่างการจอง:', error);
        Swal.fire({
          icon: 'error',
          title: 'การจองล้มเหลว!',
          text: error.error.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด.',
          confirmButtonText: 'ลองอีกครั้ง'
        });
      }
    );
  }

  verifyBooking(userId: string, boothId: string): void {
    const apiUrl = `https://wag5.bowlab.net/bookings`;
  
    this.http.get<BookingData[]>(apiUrl).subscribe(
      (bookingForpayment) => {
        if (Array.isArray(bookingForpayment) && bookingForpayment.length > 0) {
          const booking = bookingForpayment.find(b => b.user_id === userId && b.booth_id === boothId);

          if (booking) {
            this.navigateToPaymentPage(booking);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Unauthorized Access',
              text: 'You do not have permission to access this booking.',
              confirmButtonText: 'OK'
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No bookings found in the API.',
            confirmButtonText: 'OK'
          });
        }
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการจองจาก API:', error);
        Swal.fire({
          icon: 'error',
          title: 'Booking not found',
          text: 'The specified booking ID is invalid.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  navigateToPaymentPage(bookingData: BookingData): void {
    if (!bookingData || !bookingData.booking_id) {
      console.error('Booking data is missing or incomplete:', bookingData);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Booking data is missing or incomplete.',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.router.navigate(['/payment'], {
      state: {
        selectedBooth: this.selectedBooth,
        bookingData: bookingData
      }
    });
  }
  openImageDialog(boothImage: string): void {
    const imageUrl = `assets/img/zone/${boothImage}`; // สร้าง URL ให้ถูกต้อง
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl } // ส่งข้อมูล imageUrl ไปยัง dialog
    });
  }
}
