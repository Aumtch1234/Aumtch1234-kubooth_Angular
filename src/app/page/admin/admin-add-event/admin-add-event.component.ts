import { Component,ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'; // นำเข้า DatePipe


import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-admin-add-event',
  standalone: true,
  providers: [DatePipe],
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
  ],changeDetection: ChangeDetectionStrategy.OnPush,
  
  templateUrl: './admin-add-event.component.html',
  styleUrls: ['./admin-add-event.component.scss']
})
export class AdminAddEventComponent {
  newEvent = {
    event_id: '',
    event_name: '',
    start_at_date: '',
    end_at_date: ''
  };

  constructor(public dialogRef: MatDialogRef<AdminAddEventComponent>) {}

  onSubmit(): void {
    this.dialogRef.close(this.newEvent);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
