import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AdminAddEventComponent } from '../admin-add-event/admin-add-event.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AddEventResponse {
  status: string;
  message: string;
}

@Component({
  selector: 'app-admin-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-event.component.html',
  styleUrls: ['./admin-event.component.scss']
})
export class AdminEventComponent implements OnInit {
  events: any[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.http.get<any[]>('https://wag5.bowlab.net/events').subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error('Error fetching events:', error);
        Swal.fire({
          icon: 'error',
          title: 'โหลดกิจกรรมล้มเหลว',
          text: 'ไม่สามารถโหลดกิจกรรมได้ โปรดลองอีกครั้ง!',
          confirmButtonText: 'ตกลง'
        });
      }
    );
  }

  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AdminAddEventComponent, {
      width: '600px', // กำหนดความกว้างตามต้องการ เช่น 600px หรือ 80%
      height: 'auto'  // ปล่อยให้สูงอัตโนมัติ
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEvent(result);
      }
    });
  }

  addEvent(newEvent: any): void {
    console.log('Sending event data:', newEvent);  // แสดงค่าที่ส่งไปที่นี่
    this.http.post<AddEventResponse>('https://wag5.bowlab.net/admin/events/insert', newEvent).subscribe(
      (response) => {
        console.log('Response from adding event:', response);
        this.fetchEvents();
  
        if (response.status === "success") {
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มกิจกรรมสำเร็จ',
            text: response.message || 'กิจกรรมของคุณถูกเพิ่มเรียบร้อยแล้ว!',
            confirmButtonText: 'ตกลง'
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'การเพิ่มกิจกรรมไม่สำเร็จ',
            text: response.message || 'กรุณาลองอีกครั้ง!',
            confirmButtonText: 'ตกลง'
          });
        }
      },
      (error) => {
        console.error('Error adding event:', error);
        const errorMessage = error.error?.message || 'เกิดข้อผิดพลาดในการเพิ่มกิจกรรม โปรดลองใหม่อีกครั้ง!';
        Swal.fire({
          icon: 'error',
          title: 'เพิ่มกิจกรรมล้มเหลว',
          text: errorMessage,
          confirmButtonText: 'ตกลง'
        });
      }
    );
  }
  
}
