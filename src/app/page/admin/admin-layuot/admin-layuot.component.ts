import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-layuot',
  standalone: true,
  imports: [
    RouterModule,
    AdminHeaderComponent
  ],
  templateUrl: './admin-layuot.component.html',
  styleUrl: './admin-layuot.component.scss'
})
export class AdminLayuotComponent {

}
