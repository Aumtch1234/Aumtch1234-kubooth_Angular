import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BoothDialogComponent } from '../../dialog/booth-dialog/booth-dialog.component'; // นำเข้าคอมโพเนนต์ที่คุณสร้างขึ้น

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  httpClient = inject(HttpClient);
  data: any = [];
  events: any = [];
  booths: any = [];
  selectedZone: any = null;

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    // ดึงข้อมูลบูธ
    this.httpClient.get('https://wag5.bowlab.net/booth').subscribe({
      next: (booths: any) => {
        this.booths = booths;

        // ดึงข้อมูลโซนและอีเวนต์
        this.httpClient.get('https://wag5.bowlab.net/zone').subscribe({
          next: (zones: any) => {
            this.data = zones;

            this.httpClient.get('https://wag5.bowlab.net/events').subscribe({
              next: (events: any) => {
                this.events = events;

                // จับคู่ข้อมูล
                this.data = this.data.map((zone: any) => {
                  const matchedEvent = this.events.find((event: any) => event.event_id === zone.event_id);
                  const matchedBooths = this.booths.filter((booth: any) => booth.zone_id === zone.zone_id);

                  return {
                    ...zone,
                    event_name: matchedEvent ? matchedEvent.event_name : 'ไม่พบกิจกรรม/งาน!!',
                    booths: matchedBooths
                  };
                });
              }
            });
          }
        });
      }
    });
  }

  openModal(zone: any) {
    const dialogRef = this.dialog.open(BoothDialogComponent, {
      data: zone, // ส่งข้อมูลโซนไปยัง dialog

      width: '100%', // กำหนดขนาดความกว้างของ dialog เป็น 80% ของหน้าจอ
      height: '100%', // กำหนดขนาดความสูงของ dialog เป็น 80% ของหน้าจอ
      maxWidth: '1000px', // หรือใช้ maxWidth เพื่อกำหนดขนาดสูงสุด
      maxHeight: '600px' // กำหนดขนาดสูงสุดของความสูง (อาจใช้กับหน้าจอเล็กๆ)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // คุณสามารถจัดการกับผลลัพธ์ที่ส่งกลับจาก dialog ที่นี่
    });
  }
}
