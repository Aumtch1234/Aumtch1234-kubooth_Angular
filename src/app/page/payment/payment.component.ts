import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  bookingData: any;
  selectedBooth: any;
  zoneName: any[] = [];
  eventName: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.bookingData = history.state.bookingData;
    console.log('Received Booking Data in Payment Page:', this.bookingData);
  
    const eventApiUrl = `https://wag5.bowlab.net/events/${this.bookingData.event_id}`;
    this.http.get(eventApiUrl).subscribe(
      (eventData: any) => {
        this.eventName = eventData;
        console.log('Event Data:', eventData);
      },
      (error) => {
        console.error('Failed to fetch event data', error);
      }
    );
  
    const boothApiUrl = `https://wag5.bowlab.net/booth/${this.bookingData.booth_id}`;
    this.http.get(boothApiUrl).subscribe(
      (boothData: any) => {
        this.selectedBooth = boothData;
        console.log('Fetched Booth Data:', boothData); // Check the structure of boothData
        if (boothData.length > 0) {
          const zoneId = boothData[0].zone_id; // Accessing zone_id safely
          console.log('Zone ID:', zoneId);
    
          if (zoneId) {
            const zoneApiUrl = `https://wag5.bowlab.net/zone/${zoneId}`;
            this.http.get(zoneApiUrl).subscribe(
              (zoneData: any) => {
                this.zoneName = zoneData;
                console.log('Zone Data:', zoneData);
              },
              (error) => {
                console.error('Failed to fetch zone data', error);
              }
            );
          }
        } else {
          console.error('Booth data is empty');
        }
      },
      (error) => {
        console.error('Failed to fetch booth data', error);
      }
    );
    
  }
  
  submitPayment(fileInput: HTMLInputElement) {
  const file = fileInput.files ? fileInput.files[0] : null;
  if (!file) {
    Swal.fire({
      icon: 'warning',
      title: 'Notification!',
      text: "กรุณาแนบหลักฐาน หรือ สลิปการชำระเงิน",
      confirmButtonText: 'OK'
    });
    return;
  }

  const fileName = file.name; // ดึงชื่อไฟล์เท่านั้น
  const apiUrl = `https://wag5.bowlab.net/booking/payment/${this.bookingData.booking_id}`;

  // ส่งชื่อไฟล์ไปยัง API โดยไม่ต้องส่งไฟล์เต็ม
  this.http.put(apiUrl, { bill_img: fileName }).subscribe(
    (response: any) => {
      if (response && response.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'ชำระเงินสำเร็จ',
          text: response.message,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/profile']);
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Notification!',
          text: response.message,
          confirmButtonText: 'OK'
        });
      }
    },
    (error) => {
      console.error('Payment failed', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: error.error.message || 'An unexpected error occurred.',
        confirmButtonText: 'Try Again'
      });
    }
  );
}

}
