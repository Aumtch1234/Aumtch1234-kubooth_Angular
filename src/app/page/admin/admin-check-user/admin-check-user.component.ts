import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReportData {
  pname: string;
  fname: string;
  lname: string;
  phone: string;
  booth_name: string;
  zone_name: string;
  booking_status: string;
  status:string
  booking_id: string;
  bill_img: string;
}

@Component({
  selector: 'app-admin-check-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-check-user.component.html',
  styleUrls: ['./admin-check-user.component.scss']
})
export class AdminCheckUserComponent implements OnInit {
  reportData: ReportData[] = [];
  bookingStatus: string = 'no_payment';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReportData();
  }

  fetchReportData(): void {
    let url = '';

    switch (this.bookingStatus) {
      case 'no_payment':
        url = 'https://wag5.bowlab.net/admin/report_data/no_payment';
        break;
      case 'payment':
        url = 'https://wag5.bowlab.net/admin/report_data/payment';
        break;
      case 'booth_waiting':
        url = 'https://wag5.bowlab.net/admin/report_data/booth_waitng';
      break;
      case 'pass_payment':
        url = 'https://wag5.bowlab.net/admin/report_data/pass_payment';
      break;
    }

    this.http.get<ReportData[]>(url).subscribe(
      (data) => {
        this.reportData = data;
      },
      (error) => {
        console.error('Error fetching report data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error loading data',
          text: 'Unable to load data. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  onStatusChange(): void {
    this.fetchReportData();
  }

  approveBooking(data: ReportData): void {
    // API call or approval action (replace URL with your actual endpoint)
    this.http.put(`https://wag5.bowlab.net/admin/booking/approve/${data.booking_id}`, {}).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'อนุมัติสำเร็จ!',
          text: `การจองบูธของ ${data.pname} ${data.fname} ${data.lname} ได้รับการอนุมัติแล้ว.`,
          confirmButtonText: 'ตกลง'
        });
        this.fetchReportData(); // Refresh data after approval
      },
      (error) => {
        console.error('Error approving booking:', error);
        Swal.fire({
          icon: 'error',
          title: 'Approval Failed',
          text: 'Could not approve the booking. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
