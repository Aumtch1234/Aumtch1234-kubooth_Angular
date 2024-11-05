import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-booth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './booth-dialog.component.html',
  styleUrls: ['./booth-dialog.component.scss']
})
export class BoothDialogComponent {
  selectedStatus: string = ''; // ตัวแปรสำหรับสถานะที่เลือก
  filteredBooths: any[]; // ตัวแปรสำหรับบูธที่กรองแล้ว

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
  private router: Router,
  private dialogRef: MatDialogRef<BoothDialogComponent>,
  private dialog: MatDialog
) {
  console.log("Received data in BoothDialogComponent:", data); // แสดงข้อมูลที่ได้รับจาก MAT_DIALOG_DATA
  this.filteredBooths = data.booths; // เริ่มต้นด้วยบูธทั้งหมด
}
  filterBooths(): void {
    if (this.selectedStatus) {
      this.filteredBooths = this.data.booths.filter((booth: { status: string; }) => booth.status === this.selectedStatus);
    } else {
      this.filteredBooths = this.data.booths; // ถ้าไม่มีการเลือกให้แสดงทั้งหมด
    }
  }

  goToBook(booth: any) {
    const boothData = {
      ...booth,
      zone_name: this.data.zone_name, // ส่ง zone_name ด้วย
      event_id: this.data.event_id
    };
    this.dialogRef.close();
    this.router.navigate(['book-booth'], { state: { booth: boothData } });
  } 
  

  closeDialog() {
    this.dialogRef.close(); // ปิด dialog เมื่อกดปุ่ม X
  }

  openImageDialog(boothImage: string): void {
    const imageUrl = `assets/img/zone/${boothImage}`; // สร้าง URL ให้ถูกต้อง
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl } // ส่งข้อมูล imageUrl ไปยัง dialog
    });
  }
}
